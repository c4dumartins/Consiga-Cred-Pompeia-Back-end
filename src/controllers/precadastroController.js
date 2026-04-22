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

  // Validação dos campos obrigatórios (alinhada com o novo formulário)
  const obrigatorios = ["nome", "telefone", "cpf", "modalidade", "renda"];
  const faltando = obrigatorios.filter((c) => !dados[c]);

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