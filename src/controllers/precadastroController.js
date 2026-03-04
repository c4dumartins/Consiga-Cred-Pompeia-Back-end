// ============================================================
//  src/controllers/precadastroController.js
// ============================================================
const nodemailer = require("nodemailer");
const { emailEmpresa, emailCliente } = require("../emailTemplates");

// Transporter criado uma única vez (reutilizado em todas as chamadas)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Senha de App do Google — NÃO a senha normal
  },
});

// Verifica conexão com Gmail ao iniciar o módulo
transporter.verify((error) => {
  if (error) {
    console.error("❌ Gmail (pré-cadastro) — erro de conexão:", error.message);
  } else {
    console.log("✅ Gmail (pré-cadastro) conectado com sucesso!");
  }
});

// ── POST /precadastro ─────────────────────────────────────────
exports.enviarPreCadastro = async (req, res) => {
  const dados = req.body;

  // Validação dos campos obrigatórios
  const obrigatorios = ["nome", "email", "telefone", "cpf", "tipoConsorcio", "valorDesejado", "prazo"];
  const faltando = obrigatorios.filter((c) => !dados[c]);

  if (faltando.length > 0) {
    return res.status(400).json({
      error: "Campos obrigatórios faltando",
      campos: faltando,
    });
  }

  try {
    // E-mail 1: Para a EMPRESA
    const paraEmpresa = {
      from: `"ConsigaCred — Site" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_EMPRESA,
      replyTo: dados.email,
      subject: `🏦 Novo Pré-Cadastro: ${dados.nome} — ${dados.tipoConsorcio}`,
      html: emailEmpresa(dados),
    };

    // E-mail 2: Para o CLIENTE
    const paraCliente = {
      from: `"ConsigaCred" <${process.env.EMAIL_USER}>`,
      to: dados.email,
      subject: "✅ Seu Pré-Cadastro foi Recebido — ConsigaCred",
      html: emailCliente(dados),
    };

    // Dispara os dois e-mails em paralelo
    const [resEmpresa, resCliente] = await Promise.allSettled([
      transporter.sendMail(paraEmpresa),
      transporter.sendMail(paraCliente),
    ]);

    // Log detalhado no terminal
    console.log(`\n📩 Pré-Cadastro: ${dados.nome} <${dados.email}>`);
    console.log(`   ${resEmpresa.status === "fulfilled" ? "✅" : "❌"} E-mail empresa → ${process.env.EMAIL_EMPRESA}`);
    console.log(`   ${resCliente.status  === "fulfilled" ? "✅" : "❌"} E-mail cliente → ${dados.email}`);

    if (resEmpresa.status === "rejected") {
      console.error("   Detalhe empresa:", resEmpresa.reason?.message);
      // E-mail da empresa é crítico — retorna erro para o frontend
      return res.status(500).json({ error: "Falha ao processar o cadastro. Tente novamente." });
    }

    if (resCliente.status === "rejected") {
      console.error("   Detalhe cliente:", resCliente.reason?.message);
      // E-mail do cliente falhou mas o da empresa chegou — retorna sucesso parcial
    }

    return res.status(200).json({
      success: true,
      message: "Pré-cadastro enviado com sucesso!",
      emailCliente: resCliente.status === "fulfilled" ? "enviado" : "falhou",
    });

  } catch (err) {
    console.error("❌ Erro inesperado em enviarPreCadastro:", err.message);
    return res.status(500).json({ error: "Erro interno. Tente novamente." });
  }
};