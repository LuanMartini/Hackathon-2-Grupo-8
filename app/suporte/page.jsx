"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Clock3, Gauge, TicketCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatsCard } from "@/components/StatsCard";
import { TicketTable } from "@/components/TicketTable";
import { TicketDetail } from "@/components/TicketDetail";
import { loadSupportTickets } from "@/lib/support-storage";
import { weeklyVolume } from "@/data/mockInsights";
import { SecurityMvpCard } from "@/components/SecurityMvpCard";

const priorityCopy = { Alta: "Investigar hoje", Média: "Acompanhar nesta fila", Baixa: "Pode seguir no fluxo normal" };
const samplePriorities = [
  { id: "#1042", title: "Falha na emissão de nota fiscal", category: "Integração", confidence: 87, priority: "Alta" },
  { id: "#1041", title: "Conta bloqueada após tentativas", category: "Acesso", confidence: 92, priority: "Alta" },
  { id: "#1038", title: "Nota parada em processamento", category: "Serviço externo", confidence: 82, priority: "Alta" },
];

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => { const refresh = () => setTickets(loadSupportTickets()); refresh(); window.addEventListener("support-tickets-updated", refresh); return () => window.removeEventListener("support-tickets-updated", refresh); }, []);

  const openTickets = useMemo(() => tickets.filter((ticket) => ticket.status !== "Resolvido"), [tickets]);
  const priorityTickets = useMemo(() => openTickets.filter((ticket) => ticket.priority === "Alta").slice(0, 3), [openTickets]);
  const openCount = openTickets.length + 17;
  const attentionCount = priorityTickets.length || 3;
  const resolutionRate = Math.round(((tickets.filter((ticket) => ticket.status === "Resolvido").length + 36) / (tickets.length + 44 || 1)) * 100);
  const visiblePriorities = priorityTickets.length ? priorityTickets : samplePriorities;
  const awaitingCount = tickets.filter((ticket) => ticket.status === "Aguardando informação").length;
  const positiveFeedback = tickets.filter((ticket) => ticket.evaluation?.resolved === true).length;
  const negativeFeedback = tickets.filter((ticket) => ticket.evaluation?.resolved === false).length;
  const qualityTickets = tickets.filter((ticket) => ticket.quality?.score);
  const averageQuality = qualityTickets.length ? Math.round(qualityTickets.reduce((sum, ticket) => sum + ticket.quality.score, 0) / qualityTickets.length) : 78;
  const similarCount = tickets.reduce((sum, ticket) => sum + (ticket.similarTickets?.length || 0), 0);

  return <main className="p-4 sm:p-7 lg:p-9">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-bold text-primary">VISÃO GERAL</p><h1 className="mt-2 text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">A operação está sob controle.</h1><p className="mt-2 max-w-2xl text-slate-500">Há <strong className="font-semibold text-slate-700">{attentionCount} chamados que pedem atenção hoje</strong>. Comece pelos casos de maior impacto e acompanhe os sinais da semana.</p></div>
        <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><a href="/suporte/chamados">Ver central<ArrowRight className="size-4" /></a></Button><Button onClick={() => location.href = "/"}>Novo diagnóstico<ArrowRight className="size-4" /></Button></div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={TicketCheck} label="Chamados em andamento" value={openCount} note="+3 desde ontem" />
        <StatsCard icon={AlertTriangle} label="Prioridade alta" value={attentionCount} note="Ação recomendada hoje" />
        <StatsCard icon={Clock3} label="Tempo médio de triagem" value="4m 32s" note="-38s nesta semana" />
        <StatsCard icon={CheckCircle2} label="Resolvidos no prazo" value={`${resolutionRate}%`} note="Meta: 85%" />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><article className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-bold text-amber-900">Aguardando usuário</p><p className="mt-3 text-3xl font-bold text-amber-950">{awaitingCount}</p><p className="mt-1 text-sm text-amber-800">Casos que precisam de uma resposta.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold text-slate-700">Qualidade média</p><p className="mt-3 text-3xl font-bold text-slate-950">{averageQuality}%</p><p className="mt-1 text-sm text-slate-500">Relatos estruturados para triagem.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold text-slate-700">Avaliações</p><p className="mt-3 text-2xl font-bold text-slate-950">{positiveFeedback} positivas <span className="text-slate-300">/</span> {negativeFeedback} negativas</p><p className="mt-1 text-sm text-slate-500">Respostas após chamados resolvidos.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold text-slate-700">Casos parecidos</p><p className="mt-3 text-3xl font-bold text-slate-950">{similarCount}</p><p className="mt-1 text-sm text-slate-500">Sinalizações antes da abertura.</p></article></section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10"><Gauge className="size-5" /></span><div><p className="text-sm font-bold">Prioridades de hoje</p><p className="mt-1 text-sm text-slate-300">Casos que combinam impacto alto e evidência suficiente para agir.</p></div></div><span className="w-fit rounded-full bg-amber-300 px-2.5 py-1 text-xs font-bold text-amber-950">{attentionCount} em foco</span>
          </div>
          <div className="divide-y divide-slate-100">{visiblePriorities.map((ticket) => <button key={ticket.id} type="button" onClick={() => { const found = tickets.find((item) => item.id === ticket.id); if (found) setSelected(found); }} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><AlertTriangle className="size-5" /></span><span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-900">{ticket.title}</span><span className="mt-1 block text-sm text-slate-500">{ticket.category} · {ticket.confidence}% de confiança</span></span><span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 sm:block">{priorityCopy[ticket.priority]}</span><ArrowRight className="size-4 shrink-0 text-slate-400" /></button>)}</div>
          <div className="flex items-center justify-between bg-slate-50 px-5 py-4 sm:px-6"><p className="text-sm text-slate-500">Use o diagnóstico completo para confirmar a primeira ação.</p><Button asChild size="sm" variant="ghost"><a href="/suporte/chamados">Abrir fila<ArrowRight className="size-4" /></a></Button></div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-950">Sinal da semana</p><p className="mt-1 text-sm text-slate-500">Volume de diagnósticos guiados</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><TrendingUp className="size-3.5" />12%</span></div><div className="mt-7 flex h-36 items-end gap-2.5">{weeklyVolume.map((item) => <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="rounded-t-lg bg-blue-100 transition hover:bg-primary" style={{ height: `${item.value * 2.6}%` }} title={`${item.value} diagnósticos`} /><span className="text-center text-xs font-medium text-slate-400">{item.day}</span></div>)}</div><div className="mt-6 rounded-2xl bg-blue-50 p-4"><div className="flex gap-3"><Activity className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-semibold text-slate-900">Integrações lideram as ocorrências</p><p className="mt-1 text-sm leading-5 text-slate-600">Quinta-feira concentrou o maior volume. Vale conferir o status das integrações antes do próximo pico.</p></div></div></div></section>
      </section>

      <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="font-bold text-slate-950">Fila recente</h2><p className="mt-1 text-sm text-slate-500">Cada relato já traz o caminho percorrido no questionário.</p></div><Button asChild variant="ghost" size="sm"><a href="/suporte/chamados">Ver todos<ArrowRight className="size-4" /></a></Button></div><TicketTable tickets={tickets} limit={7} onSelect={setSelected} /></section>
      <div className="mt-7"><SecurityMvpCard /></div>
    </div>
    <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl"><SheetHeader className="border-b border-slate-200 p-6"><SheetTitle>Detalhes do chamado</SheetTitle><SheetDescription>Diagnóstico estruturado e caminho percorrido.</SheetDescription></SheetHeader><div className="p-6"><TicketDetail ticket={selected} /></div></SheetContent></Sheet>
  </main>;
}
