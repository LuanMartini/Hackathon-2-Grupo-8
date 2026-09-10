function normalizeText(value = "") {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesWholePhrase(text, phrase) {
  const expression = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeForRegExp(phrase)}(?=$|[^\\p{L}\\p{N}])`, "u");
  return expression.test(text);
}

const treePriorities = [
  { id: "notifications", terms: ["e-mail", "email", "notificacao", "alerta", "confirmacao", "nao recebi"] },
  { id: "reports", terms: ["relatorio", "exportar", "exportacao", "planilha", "download", "baixar", "pdf", "excel", "csv", "gerar relatorio"] },
  { id: "registration", terms: ["cadastro", "cadastrar", "salvar cliente", "salvar cadastro", "novo cliente"] },
  { id: "invoice", terms: ["nota fiscal", "emitir nota", "nota"] },
  { id: "login", terms: ["conta bloqueada", "login", "senha", "entrar", "acessar", "conta"] },
  { id: "performance", terms: ["lentidao", "lento", "devagar", "travando", "demora"] },
];

// A ordem representa prioridade de contexto. A busca é por palavras ou frases completas,
// evitando que um trecho de outra palavra leve o relato para uma árvore incorreta.
export function selectDiagnosticTreeId(description = "") {
  const normalized = normalizeText(description);
  return treePriorities.find((tree) => tree.terms.some((term) => includesWholePhrase(normalized, term)))?.id || "general";
}
