// ============================================================
//  src/emailTemplates.js
// ============================================================

// ── Helper: mapas de tradução ─────────────────────────────────
const MODALIDADES = {
  inss:      "Consignado INSS",
  servidor:  "Consignado Servidor Público",
  clt:       "Crédito do Trabalhador",
  fgts:      "Antecipação do FGTS",
  energia:   "Empréstimo — Conta de Energia",
  cartao:    "Empréstimo no Cartão",
  veiculos:  "Financiamento de Veículos",
  garantia:  "Crédito com Garantia de Veículo",
};

const COMO_CONHECEU = {
  google:    "Google",
  instagram: "Instagram",
  facebook:  "Facebook",
  indicacao: "Indicação",
  whatsapp:  "WhatsApp",
  outro:     "Outro",
};

function traduzir(mapa, valor) {
  return mapa[valor] || valor || "Não informado";
}

// ── Helper: linha de campo ─────────────────────────────────────
function campoLinha(label, valor, destaque = false) {
  return `
  <div style="display:flex;justify-content:space-between;align-items:flex-start;
    padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
    <span style="color:rgba(255,255,255,0.4);font-size:13px;min-width:150px;">${label}</span>
    <span style="color:${destaque ? "#ff6b6b" : "rgba(255,255,255,0.85)"};font-size:13px;
      font-weight:600;text-align:right;flex:1;padding-left:16px;">
      ${valor || "Não informado"}
    </span>
  </div>`;
}

// ============================================================
//  E-MAIL PARA A EMPRESA
// ============================================================
function emailEmpresa(dados) {
  const {
    // Passo 1 — Dados Pessoais
    nome, cpf, dataNascimento, telefone, email,
    // Passo 2 — Endereço
    cep, logradouro, numero, complemento, bairro, cidade, estado,
    // Passo 3 — Simulação
    modalidade, renda, comoConheceu, mensagem,
  } = dados;

  const dataFormatada = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const telefoneNumeros = (telefone || "").replace(/\D/g, "");
  const primeiroNome    = (nome || "").split(" ")[0];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#e30613,#c00010);
    border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
       Nova Solicitação de Simulação
    </h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${dataFormatada}</p>
  </td></tr>

  <!-- ALERTA -->
  <tr><td style="background:#1a0000;padding:18px 40px;
    border-left:4px solid #e30613;border-right:4px solid #e30613;">
    <p style="margin:0;color:#ff6b6b;font-size:14px;font-weight:600;">
      ⚡ Um novo cliente preencheu o formulário e aguarda contato!
    </p>
  </td></tr>

  <!-- DADOS PESSOAIS -->
  <tr><td style="background:#111;padding:30px 40px 8px;">
    <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;
      letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
      👤 Dados Pessoais
    </h2>
    ${campoLinha("Nome Completo",  nome)}
    ${campoLinha("CPF",            cpf)}
    ${campoLinha("Nascimento",     dataNascimento)}
    ${campoLinha("Telefone / WhatsApp", telefone, true)}
    ${email ? campoLinha("E-mail", email, true) : ""}
  </td></tr>

  <!-- ENDEREÇO (opcional — exibe só se algum campo foi preenchido) -->
  ${(logradouro || cidade || estado) ? `
  <tr><td style="background:#111;padding:20px 40px 8px;">
    <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;
      letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
      📍 Endereço
    </h2>
    ${cep        ? campoLinha("CEP",      cep)  : ""}
    ${logradouro ? campoLinha("Endereço", `${logradouro}, ${numero || "s/n"}${complemento ? " — " + complemento : ""}`) : ""}
    ${bairro     ? campoLinha("Bairro",   bairro) : ""}
    ${(cidade || estado) ? campoLinha("Cidade / Estado", `${cidade || ""} — ${estado || ""}`) : ""}
  </td></tr>` : ""}

  <!-- SIMULAÇÃO -->
  <tr><td style="background:#111;padding:20px 40px 28px;">
    <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;
      letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
      💰 Dados da Simulação
    </h2>
    ${campoLinha("Modalidade",     traduzir(MODALIDADES,   modalidade))}
    ${campoLinha("Renda Líquida",  renda ? `R$ ${renda}` : null)}
    ${campoLinha("Como nos conheceu", traduzir(COMO_CONHECEU, comoConheceu))}
    ${mensagem ? `
    <div style="margin-top:14px;">
      <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;
        text-transform:uppercase;letter-spacing:1px;">Observações</p>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
        border-radius:10px;padding:14px;">
        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;line-height:1.7;">${mensagem}</p>
      </div>
    </div>` : ""}
  </td></tr>

  <!-- AÇÕES RÁPIDAS -->
  <tr><td style="background:#0d0d0d;padding:24px 40px 32px;border-radius:0 0 16px 16px;
    border-top:1px solid rgba(255,255,255,0.06);">
    <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;
      text-transform:uppercase;letter-spacing:2px;">
      ⚡ Ações Rápidas
    </h2>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:12px;">
          <a href="https://api.whatsapp.com/send?phone=55${telefoneNumeros}&text=Ol%C3%A1%20${encodeURIComponent(primeiroNome)}%2C%20sou%20da%20ConsigaCred%20e%20recebi%20sua%20solicita%C3%A7%C3%A3o%20de%20simula%C3%A7%C3%A3o!%20Posso%20te%20ajudar%3F"
            style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;
            text-decoration:none;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:700;">
            💬 WhatsApp do Cliente
          </a>
        </td>
        ${email ? `<td>
          <a href="mailto:${email}?subject=Sua%20Simula%C3%A7%C3%A3o%20-%20ConsigaCred&body=Ol%C3%A1%20${encodeURIComponent(primeiroNome)}%2C%20recebemos%20sua%20solicita%C3%A7%C3%A3o!"
            style="display:inline-block;background:rgba(255,255,255,0.07);color:#fff;
            text-decoration:none;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:700;
            border:1px solid rgba(255,255,255,0.12);">
            ✉️ Responder por E-mail
          </a>
        </td>` : ""}
      </tr>
    </table>
  </td></tr>

  <!-- RODAPÉ -->
  <tr><td style="padding:24px 0 0;text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;line-height:1.7;">
      ConsigaCred • Rua Senador Rodolfo Miranda, 284 • Pompeia, SP<br/>
      E-mail gerado automaticamente pelo sistema de simulação.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

module.exports = { emailEmpresa };