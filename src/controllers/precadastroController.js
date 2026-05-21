// ============================================================
//  src/controllers/precadastroController.js
// ============================================================
const nodemailer = require("nodemailer");
const { emailEmpresa } = require("../emailTemplates");

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
  // Compatibilidade: garantir que o campo possuiContaEnergia seja boolean ou 'sim'/'nao'
  if (dados.modalidade === 'energia') {
    // Aceita tanto string quanto boolean vindos do front
    if (typeof dados.possuiContaEnergia === 'string') {
      dados.possuiContaEnergia = dados.possuiContaEnergia.trim().toLowerCase() === 'sim';
    } else {
      dados.possuiContaEnergia = !!dados.possuiContaEnergia;
    }
  }

  // Validação dos campos obrigatórios (alinhada com o novo formulário)
  const obrigatorios = dados.modalidade === 'energia'
    ? ["nome", "telefone", "cpf", "modalidade", "possuiContaEnergia"]
    : ["nome", "telefone", "cpf", "modalidade", "renda"];

  const faltando = obrigatorios.filter((campo) => {
    const valor = dados[campo];
    if (campo === 'possuiContaEnergia') {
      // aceitar tanto true quanto false — somente falta se indefinido
      return typeof dados.possuiContaEnergia === 'undefined';
    }
    if (typeof valor === 'string') return valor.trim() === '';
    return typeof valor === 'undefined' || valor === null || valor === '';
  });

  if (faltando.length > 0) {
    return res.status(400).json({
      error: "Campos obrigatórios faltando",
      campos: faltando,
    });
  }

  try {
    // E-mail apenas para a EMPRESA
    const paraEmpresa = {
      from: `"ConsigaCred — Site" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_EMPRESA,
      replyTo: dados.email || process.env.EMAIL_USER,
      subject: `🏦 Nova Simulação: ${dados.nome} — ${dados.modalidade}`,
      html: emailEmpresa(dados),
    };

    const resEmpresa = await transporter.sendMail(paraEmpresa);

    console.log(`\n📩 Nova Simulação: ${dados.nome}`);
    console.log(`   ✅ E-mail empresa → ${process.env.EMAIL_EMPRESA}`);
    console.log(`   ID: ${resEmpresa.messageId}`);

    return res.status(200).json({
      success: true,
      message: "Simulação enviada com sucesso!",
    });

  } catch (err) {
    console.error("❌ Erro ao enviar e-mail da empresa:", err.message);
    return res.status(500).json({ error: "Falha ao processar a simulação. Tente novamente." });
  }
};