"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TicketTable } from "@/components/TicketTable";
import { TicketDetail } from "@/components/TicketDetail";
import { loadSupportTickets } from "@/lib/support-storage";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]); const [query, setQuery] = useState(""); const [selected, setSelected] = useState(null);
  useEffect(() => { const refresh = () => setTickets(loadSupportTickets()); refresh(); window.addEventListener("support-tickets-updated", refresh); return () => window.removeEventListener("support-tickets-updated", refresh); }, []);
  const filtered = useMemo(() => tickets.filter((ticket) => `${ticket.id} ${ticket.title} ${ticket.category} ${ticket.user?.name || ""}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [tickets, query]);
  return <main className="p-4 sm:p-7 lg:p-9"><div className="mx-auto max-w-7xl"><div className="mb-7"><p className="text-sm font-bold text-primary">OPERAÇÃO</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Chamados</h1><p className="mt-2 text-slate-500">Todos os relatos já chegam com o contexto do diagnóstico.</p></div><div className="mb-5 max-w-md"><label htmlFor="ticket-search" className="sr-only">Buscar chamados</label><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input id="ticket-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por problema, pessoa ou categoria" className="h-11 bg-white pl-10" /></div></div><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-slate-950">{filtered.length} chamados encontrados</h2></div>{filtered.length ? <TicketTable tickets={filtered} onSelect={setSelected} /> : <p className="p-8 text-center text-sm text-slate-500">Não encontramos chamados com essa busca. Tente outro termo.</p>}</section></div><Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl"><SheetHeader className="border-b border-slate-200 p-6"><SheetTitle>Detalhes do chamado</SheetTitle><SheetDescription>Respostas, hipóteses e próximos passos.</SheetDescription></SheetHeader><div className="p-6"><TicketDetail ticket={selected} /></div></SheetContent></Sheet></main>;
}
