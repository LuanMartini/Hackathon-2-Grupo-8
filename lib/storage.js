import { mockTickets } from "@/data/mockTickets";
import { getDemoProfile, isSupportProfile } from "@/lib/demo-access";
import { calculateTicketQuality, findSimilarTickets } from "@/lib/ticket-helpers";

const TICKET_KEY = "support-clear-tickets-v1";
const statuses = ["Aberto", "Em análise", "Aguardando informação", "Resolvido"];

function emitTicketsUpdated() { if (typeof window !== "undefined") window.dispatchEvent(new Event("support-tickets-updated")); }

export function getCustomTickets() {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(TICKET_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function loadTicketsForCurrentProfile() {
  const profile = getDemoProfile();
  if (!profile) return [];
  const tickets = getCustomTickets();
  return isSupportProfile(profile) ? tickets : tickets.filter((ticket) => ticket.userId === profile.id);
}

export function saveTicket(ticket) {
  try { localStorage.setItem(TICKET_KEY, JSON.stringify([ticket, ...getCustomTickets()])); emitTicketsUpdated(); return { ok: true }; }
  catch { return { ok: false, error: "Não foi possível salvar o chamado neste dispositivo. Tente uma imagem menor." }; }
}

function replaceCustomTicket(id, updater) {
  const tickets = getCustomTickets();
  const current = tickets.find((ticket) => ticket.id === id);
  if (!current) return { ok: false, error: "Interações ficam disponíveis somente em chamados criados neste navegador." };
  try {
    const updated = updater(current);
    localStorage.setItem(TICKET_KEY, JSON.stringify(tickets.map((ticket) => ticket.id === id ? updated : ticket)));
    emitTicketsUpdated();
    return { ok: true, ticket: updated };
  } catch (error) { return { ok: false, error: error.message || "Não foi possível atualizar o chamado." }; }
}

export function updateTicketStatus(id, status) {
  const profile = getDemoProfile();
  if (!isSupportProfile(profile)) return { ok: false, error: "Somente o suporte pode alterar o status." };
  if (!statuses.includes(status)) return { ok: false, error: "Status inválido." };
  return replaceCustomTicket(id, (ticket) => ({ ...ticket, status, statusHistory: [...(ticket.statusHistory || []), { status, at: new Date().toISOString(), author: profile.name, role: profile.role }] }));
}

export function addTicketComment(id, content, requestDetails = false) {
  const profile = getDemoProfile();
  if (!profile || !content.trim()) return { ok: false, error: "Escreva uma mensagem antes de enviar." };
  return replaceCustomTicket(id, (ticket) => {
    if (!isSupportProfile(profile) && ticket.userId !== profile.id) throw new Error("Acesso negado ao chamado.");
    const nextStatus = isSupportProfile(profile) && requestDetails ? "Aguardando informação" : (!isSupportProfile(profile) && ticket.status === "Aguardando informação" ? "Em análise" : ticket.status);
    const statusHistory = nextStatus === ticket.status ? ticket.statusHistory || [] : [...(ticket.statusHistory || []), { status: nextStatus, at: new Date().toISOString(), author: profile.name, role: profile.role }];
    return { ...ticket, status: nextStatus, statusHistory, comments: [...(ticket.comments || []), { id: `c-${Date.now()}`, content: content.trim(), at: new Date().toISOString(), author: profile.name, role: profile.role }] };
  });
}

export function saveTicketEvaluation(id, resolved, comment = "") {
  const profile = getDemoProfile();
  if (!profile || isSupportProfile(profile)) return { ok: false, error: "A avaliação é exclusiva da pessoa usuária." };
  return replaceCustomTicket(id, (ticket) => {
    if (ticket.userId !== profile.id || ticket.status !== "Resolvido") throw new Error("A avaliação não está disponível para este chamado.");
    return { ...ticket, evaluation: { resolved, comment: comment.trim(), at: new Date().toISOString(), author: profile.name } };
  });
}

export function getTicketByIdForCurrentProfile(id) { return loadTicketsForCurrentProfile().find((ticket) => ticket.id === id) || null; }

export function getSimilarTicketsForResult(result) { return findSimilarTickets({ title: result?.title, description: result?.description, category: result?.category }, [...getCustomTickets(), ...mockTickets]); }

export function createTicketFromResult(result, analysis, actions, options = {}) {
  const profile = getDemoProfile();
  if (!profile || (!isSupportProfile(profile) && profile.role !== "usuario")) throw new Error("Perfil de demonstração indisponível.");
  const now = new Date().toISOString();
  const quality = options.quality || calculateTicketQuality(result, options.evidence);
  return {
    id: `#${String(Date.now()).slice(-6)}`, userId: profile.id, title: result.title, description: result.description, category: result.category, priority: result.priority,
    probableCause: result.causes[0][0], confidence: result.confidence, causes: result.causes, answers: result.path, information: result.information, analysis, actions, date: now, status: "Aberto",
    user: { name: profile.name, role: profile.role === "suporte" ? "Profissional de suporte" : "Operadora", version: "3.2" }, elapsedSeconds: result.elapsedSeconds,
    evidence: options.evidence || null, environment: { createdAt: now, browser: typeof navigator !== "undefined" ? navigator.userAgent : "Navegador não identificado", device: typeof navigator !== "undefined" ? navigator.platform || "Dispositivo não identificado" : "Dispositivo não identificado", version: "3.2" },
    quality, similarTickets: options.similarTickets || [], comments: [], evaluation: null, statusHistory: [{ status: "Aberto", at: now, author: profile.name, role: profile.role }],
  };
}

// IMPORTANTE: anexos, comentários e permissões são locais neste MVP.
// Em produção, a API deve validar propriedade, perfil e acesso a cada operação.
