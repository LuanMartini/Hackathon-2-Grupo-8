function normalizeText(value = "") {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function findReportLabel(description) {
  const match = description.match(/\brelat[oó]rio\s+(mensal|semanal|di[aá]rio)\b/i);
  return match ? `relatório ${match[1].toLocaleLowerCase("pt-BR")}` : null;
}

function findEmailLabel(description) {
  const match = description.match(/\be-?mail\s+(de\s+[\p{L}\d\s-]{2,34}?)(?=\s+(?:e|mas|por[eé]m|que|não|nao)|[.,;!?]|$)/iu);
  return match ? `e-mail ${match[1].trim()}` : null;
}

function findRegistrationLabel(description) {
  const match = description.match(/\bcadastro\s+(da|do|de)\s+([\p{L}\d\s-]{2,34}?)(?=[.,;!?]|$)/iu);
  return match ? `cadastro ${match[1].toLocaleLowerCase("pt-BR")} ${match[2].trim()}` : null;
}

function findInvoiceTarget(description) {
  const match = description.match(/\bnota(?:\s+fiscal)?\s+(para\s+(?:o|a)\s+[\p{L}\d\s-]{2,34}?)(?=\s+(?:e|mas|por[eé]m|apareceu|deu|não|nao)|[.,;!?]|$)/iu);
  return match ? match[1].trim() : null;
}

// A adaptação é deliberadamente limitada: ela usa somente trechos explícitos do relato
// e nunca muda IDs, respostas ou os destinos das árvores de decisão.
export function adaptQuestionToContext(question, description = "", treeId) {
  if (!question || !description) return question;
  const normalized = normalizeText(description);

  if (treeId === "invoice") {
    const target = findInvoiceTarget(description);
    if (target && question === "A nota chegou a ser criada?") return `A nota ${target} chegou a ser criada?`;
    if (normalized.includes("emit") && question === "A nota foi enviada ao serviço de emissão?") return "A nota que você tentou emitir foi enviada ao serviço de emissão?";
  }

  if (treeId === "registration" && normalized.includes("salv")) {
    const registration = findRegistrationLabel(description);
    if (registration && question === "O sistema indica algum campo inválido ou obrigatório?") return `Ao salvar o ${registration}, o sistema indica algum campo inválido ou obrigatório?`;
  }

  if (treeId === "reports") {
    const report = findReportLabel(description);
    if (report && question === "Os filtros e o período exibidos estão corretos?") return `No ${report}, os filtros e o período exibidos estão corretos?`;
    if (report && question === "Outro usuário consegue gerar o mesmo relatório?") return `Outro usuário consegue gerar o mesmo ${report}?`;
  }

  if (treeId === "notifications") {
    const email = findEmailLabel(description);
    if (email && question === "Outras pessoas deixam de receber o mesmo aviso?") return `Outras pessoas também deixam de receber esse ${email}?`;
    if (email && question === "O e-mail também não aparece na caixa de spam ou lixo eletrônico?") return `Esse ${email} também não aparece na caixa de spam ou lixo eletrônico?`;
  }

  if (treeId === "login" && /\b(?:entrar|acessar)\s+(?:na|a)\s+conta\b/.test(normalized) && question === "Aparece alguma mensagem ao tentar entrar?") {
    return "Ao tentar entrar na conta, aparece alguma mensagem?";
  }

  return question;
}
