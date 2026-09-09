import { getDemoProfile, isSupportProfile } from "@/lib/demo-access";

const TICKET_KEY = "support-clear-tickets-v1";

export function getCustomTickets() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TICKET_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadTicketsForCurrentProfile() {
  const profile = getDemoProfile();
  if (!profile) return [];
  const tickets = getCustomTickets();
  return isSupportProfile(profile) ? tickets : tickets.filter((ticket) => ticket.userId === profile.id);
}

export function saveTicket(ticket) {
  try {
    const current = getCustomTickets();
    localStorage.setItem(TICKET_KEY, JSON.stringify([ticket, ...current]));
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível salvar o chamado neste dispositivo." };
  }
}

export function getTicketByIdForCurrentProfile(id) {
  return loadTicketsForCurrentProfile().find((ticket) => ticket.id === id) || null;
}

export function createTicketFromResult(result, analysis, actions) {
  const profile = getDemoProfile();
  if (!profile || !isSupportProfile(profile) && profile.role !== "usuario") {
    throw new Error("Perfil de demonstração indisponível.");
  }
  const id = `#${String(Date.now()).slice(-6)}`;
  return {
    id,
    userId: profile.id,
    title: result.title,
    description: result.description,
    category: result.category,
    priority: result.priority,
    probableCause: result.causes[0][0],
    confidence: result.confidence,
    causes: result.causes,
    answers: result.path,
    information: result.information,
    analysis,
    actions,
    date: new Date().toISOString(),
    status: "Aberto",
    user: { name: profile.name, role: profile.role === "suporte" ? "Profissional de suporte" : "Operadora", version: "3.2" },
    elapsedSeconds: result.elapsedSeconds,
  };
}

// IMPORTANTE: filtros no navegador são apenas uma demonstração de UX.
// A API de produção deve filtrar por usuário e validar autorização no servidor.
