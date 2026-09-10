"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppHeader } from "@/components/AppHeader";
import { TicketTable } from "@/components/TicketTable";
import { TicketDetail } from "@/components/TicketDetail";
import { loadOwnTicketsForCurrentProfile } from "@/lib/storage";
import { useDemoProfile } from "@/lib/demo-access";

export default function MyTicketsPage() {
  const router = useRouter();
  const profile = useDemoProfile();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => { const refresh = () => { if (profile) setTickets(loadOwnTicketsForCurrentProfile()); }; refresh(); window.addEventListener("support-tickets-updated", refresh); return () => window.removeEventListener("support-tickets-updated", refresh); }, [profile]);
  return <main className="min-h-screen bg-slate-50"><AppHeader /><div className="mx-auto max-w-6xl px-5 py-10 lg:px-8"><div className="mb-8"><p className="text-sm font-bold text-primary">ÁREA DO USUÁRIO</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Meus chamados</h1><p className="mt-2 text-slate-500">Aqui você acompanha somente os chamados criados neste perfil de demonstração.</p></div><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-primary"><Ticket className="size-5" /></span><div><h2 className="font-bold text-slate-950">{tickets.length} chamado{tickets.length === 1 ? "" : "s"} para acompanhar</h2><p className="text-sm text-slate-500">Seus chamados ficam separados dos relatos de outras pessoas.</p></div></div><Button onClick={() => router.push("/")}>Iniciar diagnóstico</Button></div>{tickets.length ? <TicketTable tickets={tickets} onSelect={setSelected} /> : <div className="p-12 text-center"><LockKeyhole className="mx-auto size-8 text-slate-300" /><h3 className="mt-4 font-bold text-slate-900">Ainda não há chamados por aqui</h3><p className="mt-2 text-sm text-slate-500">Quando precisar de ajuda, comece um diagnóstico e nós organizamos seu relato.</p></div>}</section><p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="size-4" />Proteção demonstrativa: em produção, esta regra deve ser confirmada no servidor.</p></div><Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl"><SheetHeader className="border-b border-slate-200 p-6"><SheetTitle>Meu chamado</SheetTitle><SheetDescription>Detalhes do diagnóstico que você enviou.</SheetDescription></SheetHeader><div className="p-6"><TicketDetail ticket={selected} /></div></SheetContent></Sheet></main>;
}
