function formatarValor(chave, valor) {
    if (!valor) return "Não informado";
  
    const mapas = {
      tipoConsorcio: {
        "Antecipação do FGTS": "Antecipação do FGTS",
        "Crédito Consignado": "Crédito Consignado",
        "Crédito do Trabalhador": "Crédito do Trabalhador",
        "Empréstimo com Débito na Conta de Energia": "Empréstimo - Conta de Energia",
        "Empréstimo no Cartão de Crédito": "Empréstimo no Cartão",
        "Financiamento de Veículos": "Financiamento de Veículos",
        "Crédito com Garantia de Veículo": "Crédito com Garantia de Veículo",
      },
      valorDesejado: {
        "2k": "R$ 2.000", "5k": "R$ 5.000", "10k": "R$ 10.000",
        "15k": "R$ 15.000", "20k": "R$ 20.000", "30k": "R$ 30.000",
        "40k": "R$ 40.000", "50katé100k": "R$ 50.000 até R$ 100.000",
        "100katé500k": "R$ 100.000 até R$ 500.000", "acima500k": "Acima de R$ 500.000",
      },
      comoConheceu: {
        google: "Google", instagram: "Instagram", facebook: "Facebook",
        indicacao: "Indicação", whatsapp: "WhatsApp", outro: "Outro",
      },
    };
  
    if (mapas[chave]?.[valor]) return mapas[chave][valor];
    if (chave === "prazo") return `${valor} meses`;
    return valor;
  }
  
  // ── Helper: linha de campo ────────────────────────────────────
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
  
  // ── Helper: passo numerado ────────────────────────────────────
  function passoItem(num, cor, titulo, descricao) {
    return `
    <div style="display:flex;gap:16px;margin-bottom:20px;align-items:flex-start;">
      <div style="min-width:36px;height:36px;background:${cor};border-radius:50%;
        font-size:14px;font-weight:800;color:#fff;text-align:center;line-height:36px;flex-shrink:0;">
        ${num}
      </div>
      <div>
        <p style="margin:0 0 4px;color:#fff;font-size:14px;font-weight:700;">${titulo}</p>
        <p style="margin:0;color:rgba(255,255,255,0.55);font-size:13px;line-height:1.6;">${descricao}</p>
      </div>
    </div>`;
  }
  
  // ============================================================
  //  E-MAIL PARA A EMPRESA
  // ============================================================
  function emailEmpresa(dados) {
    const {
      nome, cpf, dataNascimento, telefone, email,
      cep, logradouro, numero, complemento, bairro, cidade, estado,
      tipoConsorcio, valorDesejado, prazo, comoConheceu, mensagem,
    } = dados;
  
    const dataFormatada = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  
    const telefoneNumeros = (telefone || "").replace(/\D/g, "");
    const primeiroNome = (nome || "").split(" ")[0];
  
    return `<!DOCTYPE html>
  <html lang="pt-BR">
  <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  
    <!-- HEADER -->
    <tr><td style="background:linear-gradient(135deg,#e30613,#c00010);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
        🏦 Novo Pré-Cadastro Recebido
      </h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${dataFormatada}</p>
    </td></tr>
  
    <!-- ALERTA -->
    <tr><td style="background:#1a0000;padding:18px 40px;border-left:4px solid #e30613;border-right:4px solid #e30613;">
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
      ${campoLinha("Nome Completo", nome)}
      ${campoLinha("CPF", cpf)}
      ${campoLinha("Data de Nascimento", dataNascimento)}
      ${campoLinha("Telefone / WhatsApp", telefone, true)}
      ${campoLinha("E-mail", email, true)}
    </td></tr>
  
    <!-- ENDEREÇO -->
    <tr><td style="background:#111;padding:20px 40px 8px;">
      <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;
        letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
        📍 Endereço
      </h2>
      ${campoLinha("CEP", cep)}
      ${campoLinha("Endereço", `${logradouro || ""}, ${numero || ""}${complemento ? " — " + complemento : ""}`)}
      ${campoLinha("Bairro", bairro)}
      ${campoLinha("Cidade / Estado", `${cidade || ""} — ${estado || ""}`)}
    </td></tr>
  
    <!-- INTERESSE -->
    <tr><td style="background:#111;padding:20px 40px 28px;">
      <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;
        letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
        💰 Interesse
      </h2>
      ${campoLinha("Produto", formatarValor("tipoConsorcio", tipoConsorcio))}
      ${campoLinha("Valor Desejado", formatarValor("valorDesejado", valorDesejado))}
      ${campoLinha("Prazo", formatarValor("prazo", prazo))}
      ${campoLinha("Como nos conheceu", formatarValor("comoConheceu", comoConheceu))}
      ${mensagem ? `
      <div style="margin-top:14px;">
        <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;
          text-transform:uppercase;letter-spacing:1px;">Mensagem</p>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;padding:14px;">
          <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;line-height:1.7;">${mensagem}</p>
        </div>
      </div>` : ""}
    </td></tr>
  
    <!-- AÇÕES RÁPIDAS -->
    <tr><td style="background:#0d0d0d;padding:24px 40px 32px;border-radius:0 0 16px 16px;
      border-top:1px solid rgba(255,255,255,0.06);">
      <h2 style="margin:0 0 16px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
        ⚡ Ações Rápidas
      </h2>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:12px;">
            <a href="https://api.whatsapp.com/send?phone=55${telefoneNumeros}&text=Ol%C3%A1%20${encodeURIComponent(primeiroNome)}%2C%20sou%20da%20ConsigaCred%20e%20recebi%20seu%20pr%C3%A9-cadastro!%20Posso%20te%20ajudar%3F"
              style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;
              text-decoration:none;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:700;">
              💬 WhatsApp do Cliente
            </a>
          </td>
          <td>
            <a href="mailto:${email}?subject=Seu%20Pr%C3%A9-Cadastro%20-%20ConsigaCred&body=Ol%C3%A1%20${encodeURIComponent(primeiroNome)}%2C%20recebemos%20seu%20pr%C3%A9-cadastro!"
              style="display:inline-block;background:rgba(255,255,255,0.07);color:#fff;text-decoration:none;
              padding:12px 20px;border-radius:10px;font-size:13px;font-weight:700;
              border:1px solid rgba(255,255,255,0.12);">
              ✉️ Responder por E-mail
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  
    <!-- RODAPÉ -->
    <tr><td style="padding:24px 0 0;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;line-height:1.7;">
        ConsigaCred • Rua Senador Rodolfo Miranda, 284 • Pompeia, SP<br/>
        E-mail gerado automaticamente pelo sistema de pré-cadastro.
      </p>
    </td></tr>
  
  </table>
  </td></tr>
  </table>
  </body>
  </html>`;
  }
  
  // ============================================================
  //  E-MAIL PARA O CLIENTE
  // ============================================================
  function emailCliente(dados) {
    const { nome, tipoConsorcio, valorDesejado, prazo } = dados;
    const primeiroNome = (nome || "").split(" ")[0];
  
    return `<!DOCTYPE html>
  <html lang="pt-BR">
  <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  
    <!-- HEADER -->
    <tr><td style="background:linear-gradient(135deg,#e30613,#c00010);border-radius:16px 16px 0 0;
      padding:48px 40px;text-align:center;">
      <p style="margin:0 0 16px;font-size:48px;line-height:1;">✅</p>
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
        Pré-Cadastro Recebido!
      </h1>
      <p style="margin:12px 0 0;color:rgba(255,255,255,0.85);font-size:15px;line-height:1.6;">
        Olá, <strong>${primeiroNome}</strong>! Recebemos suas informações<br/>e entraremos em contato em breve.
      </p>
    </td></tr>
  
    <!-- CORPO -->
    <tr><td style="background:#111;padding:36px 40px;">
  
      <!-- Resumo -->
      <div style="background:rgba(227,6,19,0.06);border:1px solid rgba(227,6,19,0.2);
        border-radius:14px;padding:24px;margin-bottom:28px;">
        <h2 style="margin:0 0 14px;color:#e30613;font-size:12px;font-weight:700;
          text-transform:uppercase;letter-spacing:2px;">📋 Resumo do seu pedido</h2>
        ${campoLinha("Produto de interesse", formatarValor("tipoConsorcio", tipoConsorcio))}
        ${campoLinha("Valor desejado", formatarValor("valorDesejado", valorDesejado))}
        ${campoLinha("Prazo desejado", formatarValor("prazo", prazo))}
      </div>
  
      <!-- Próximos passos -->
      <h2 style="margin:0 0 20px;color:#fff;font-size:16px;font-weight:700;">O que acontece agora?</h2>
      ${passoItem("1", "#e30613", "Análise do Cadastro",
        "Nossa equipe vai analisar suas informações e verificar as melhores condições disponíveis para o seu perfil.")}
      ${passoItem("2", "#e30613", "Contato Personalizado",
        "Um consultor entrará em contato pelo telefone ou e-mail informado em até 1 dia útil.")}
      ${passoItem("3", "#25d366", "Proposta e Aprovação",
        "Apresentaremos a proposta ideal para você e, se aprovado, o dinheiro cai rapidinho!")}
  
    </td></tr>
  
    <!-- CTA -->
    <tr><td style="background:#111;padding:0 40px 36px;text-align:center;">
      <p style="margin:0 0 18px;color:rgba(255,255,255,0.6);font-size:14px;">
        Prefere falar com a gente agora? Estamos no WhatsApp!
      </p>
      <a href="https://api.whatsapp.com/send?phone=5514998471839&text=Ol%C3%A1!%20Acabei%20de%20preencher%20o%20pr%C3%A9-cadastro%20e%20gostaria%20de%20saber%20mais."
        style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;
        text-decoration:none;padding:16px 36px;border-radius:12px;font-size:15px;font-weight:700;
        box-shadow:0 8px 24px rgba(37,211,102,0.3);">
        💬 Falar no WhatsApp
      </a>
    </td></tr>
  
    <!-- CONTATOS -->
    <tr><td style="background:#0d0d0d;padding:24px 40px;border-radius:0 0 16px 16px;
      border-top:1px solid rgba(255,255,255,0.06);">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:0 12px;">
            <p style="margin:0 0 4px;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Telefone</p>
            <p style="margin:0;color:#fff;font-size:14px;font-weight:600;">(14) 99847-1839</p>
          </td>
          <td style="text-align:center;padding:0 12px;border-left:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0 0 4px;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Endereço</p>
            <p style="margin:0;color:#fff;font-size:13px;font-weight:600;">Pompeia, SP</p>
          </td>
        </tr>
      </table>
    </td></tr>
  
    <!-- RODAPÉ -->
    <tr><td style="padding:24px 0 0;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;line-height:1.7;">
        ConsigaCred Pompeia • Rua Senador Rodolfo Miranda, 284<br/>
        Você recebeu este e-mail porque preencheu nosso formulário de pré-cadastro.<br/>
        <span style="color:rgba(255,255,255,0.12);">Se não foi você, por favor ignore este e-mail.</span>
      </p>
    </td></tr>
  
  </table>
  </td></tr>
  </table>
  </body>
  </html>`;
  }
  
  module.exports = { emailEmpresa, emailCliente };