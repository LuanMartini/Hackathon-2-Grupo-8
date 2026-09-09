"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { TicketDetail } from "@/components/TicketDetail";
import { getTicketByIdForCurrentProfile } from "@/lib/storage";

export default function TicketPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  useEffect(() => { const id = sessionStorage.getItem("support-current-ticket"); if (id) setTicket(getTicketByIdForCurrentProfile(id)); }, []);
  if (!ticket) return <main className="min-h-screen bg-slate-50"><AppHeader /><div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-bold">Chamado não encontrado</h1><Button className="mt-6" onClick={() => router.push("/")}>Voltar ao início</Button></div></main>;
  return <main className="min-h-screen bg-slate-50"><AppHeader backHref="/resultado" backLabel="Resultado" /><div className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><div className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-6 text-emerald-700" /><div><h1 className="font-bold text-emerald-950">Chamado criado com sucesso</h1><p className="mt-1 text-sm text-emerald-800">{ticket.id} foi associado ao seu perfil e já está disponível para a equipe de suporte.</p></div></div><Button onClick={() => router.push("/meus-chamados")} className="bg-emerald-700 hover:bg-emerald-800">Ver meus chamados<ArrowRight className="size-4" /></Button></div><div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"><TicketDetail ticket={ticket} /></div></div></main>;
}
