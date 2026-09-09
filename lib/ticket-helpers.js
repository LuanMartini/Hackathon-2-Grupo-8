function normalize(value = "") {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function keywords(value = "") {
  return [...new Set(normalize(value).match(/[a-z0-9]{4,}/g) || [])].filter((word) => !["sistema", "problema", "usuario", "chamado", "suporte"].includes(word));
}

export function calculateTicketQuality(result, evidence) {
  const description = result?.description || "";
  const path = result?.path || [];
  const text = normalize(`${description} ${path.map((step) => step.information || "").join(" ")}`);
  const checks = [
    [description.trim().length >= 18, "descrição mais detalhada"], [path.length >= 2, "área ou ação afetada"],
    [/erro|codigo|mensagem|acesso negado/.test(text), "mensagem ou código do erro"],
    [/outros usuarios|alcance|restrito|tambem/.test(text), "alcance do problema"],
    [/sempre|vez|tentativa|frequencia|intermitente/.test(text), "frequência da falha"], [Boolean(evidence?.preview), "imagem do erro"],
  ];
  const completed = checks.filter(([ok]) => ok).length;
  const score = Math.round((completed / checks.length) * 100);
  return { score, label: score >= 84 ? "Completo" : score >= 50 ? "Bom" : "Básico", missing: checks.filter(([ok]) => !ok).map(([, label]) => label) };
}

export function findSimilarTickets(candidate, tickets = []) {
  const subject = keywords(`${candidate?.title || ""} ${candidate?.description || ""}`);
  return tickets.filter((ticket) => ticket.status !== "Resolvido").map((ticket) => {
    const ticketWords = keywords(`${ticket.title || ""} ${ticket.description || ""} ${ticket.category || ""}`);
    const shared = subject.filter((word) => ticketWords.includes(word));
    const categoryMatch = normalize(candidate?.category) && normalize(candidate?.category) === normalize(ticket.category);
    return { id: ticket.id, title: ticket.title, category: ticket.category, status: ticket.status, score: shared.length + (categoryMatch ? 2 : 0) };
  }).filter((ticket) => ticket.score >= 2).sort((a, b) => b.score - a.score).slice(0, 3);
}
