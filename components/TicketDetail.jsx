"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, CheckCircle2, ClipboardList, Lightbulb, Route, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CauseProbability } from "@/components/CauseProbability";
import { DiagnosticPath } from "@/components/DiagnosticPath";
import { TicketWorkflow } from "@/components/TicketWorkflow";

export function TicketDetail({ ticket }) {
  const [activeTicket, setActiveTicket] = useState(ticket);
  useEffect(() => setActiveTicket(ticket), [ticket]);
  if (!activeTicket) return null;
  const causes = activeTicket.causes.map(([name, probability]) => ({ name, probability }));
  const quality = activeTicket.quality;
  return <div className="space-y-7 pb-8">
    <section className="rounded-2xl bg-slate-950 p-5 text-white"><div className="flex flex-wrap items-center gap-2"><Badge className="bg-blue-500 text-white">{activeTicket.id}</Badge><Badge variant="outline" className="border-white/20 text-slate-200">{activeTicket.status}</Badge></div><h2 className="mt-4 text-2xl font-bold tracking-tight">{activeTicket.title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{activeTicket.description}</p><div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-sm"><div><p className="text-slate-400">Categoria</p><p className="mt-1 font-semibold">{activeTicket.category}</p></div><div><p className="text-slate-400">Prioridade</p><p className="mt-1 font-semibold">{activeTicket.priority}</p></div><div><p className="text-slate-400">Confiança</p><p className="mt-1 font-semibold">{activeTicket.confidence}%</p></div></div></section>
    <DetailSection icon={UserRound} title="Usuário afetado"><p className="font-semibold text-slate-900">{activeTicket.user.name}</p><p className="text-sm text-slate-500">{activeTicket.user.role} · versão {activeTicket.user.version}</p></DetailSection>
    {quality && <DetailSection icon={ShieldCheck} title="Qualidade do relato"><div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="text-lg font-bold text-blue-950">{quality.label} · {quality.score}%</p>{quality.missing?.length > 0 ? <p className="mt-2 text-sm leading-6 text-blue-900">Ainda ajudaria informar: {quality.missing.join(", ")}.</p> : <p className="mt-2 text-sm text-blue-900">O relato já contém os principais elementos para a triagem.</p>}</div></DetailSection>}
    {activeTicket.environment && <DetailSection icon={ClipboardList} title="Contexto técnico coletado"><p className="text-sm leading-6 text-slate-600">Criado em {new Date(activeTicket.environment.createdAt).toLocaleString("pt-BR")}. Versão {activeTicket.environment.version}. Dispositivo: {activeTicket.environment.device}.</p></DetailSection>}
    <DetailSection icon={ClipboardList} title="Informações coletadas"><ul className="space-y-2">{activeTicket.information.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></DetailSection>
    <DetailSection icon={BrainCircuit} title="Análise inteligente"><p className="text-sm leading-6 text-slate-600">{activeTicket.analysis}</p><p className="mt-3 text-xs font-medium text-slate-400">Análise demonstrativa · regras do MVP</p></DetailSection>
    {activeTicket.caseEvaluation && <DetailSection icon={ClipboardList} title="Resumo preparado para o suporte"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm leading-6 text-slate-700">{activeTicket.caseEvaluation.explanation}</p><p className="mt-2 text-sm font-semibold text-slate-900">{activeTicket.caseEvaluation.supportReason}</p><p className="mt-3 text-xs text-slate-500">O chamado inclui o relato, as respostas, as tentativas e o contexto técnico disponível neste dispositivo.</p></div></DetailSection>}
    <DetailSection icon={CheckCircle2} title="Possíveis causas"><div className="space-y-3">{causes.map((cause, index) => <CauseProbability key={cause.name} cause={cause} index={index} />)}</div></DetailSection>
    <DetailSection icon={ClipboardList} title="Próximas verificações"><ol className="space-y-3">{activeTicket.actions.map((action, index) => <li key={action} className="flex gap-3 text-sm text-slate-700"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-primary">{index + 1}</span><span className="pt-0.5">{action}</span></li>)}</ol></DetailSection>
    {activeTicket.recommendedSolution && <DetailSection icon={Lightbulb} title="Soluções apresentadas"><div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="text-sm font-semibold text-blue-950">Melhor opção sugerida: {activeTicket.recommendedSolution.title}</p>{activeTicket.solutionAttempts?.length > 0 ? <ul className="mt-3 space-y-2">{activeTicket.solutionAttempts.map((attempt) => <li key={`${attempt.solutionId}-${attempt.at}`} className="text-sm leading-6 text-blue-900"><strong>{attempt.title}</strong>: {formatAttemptOutcome(attempt.outcome)} em {new Date(attempt.at).toLocaleString("pt-BR")}.{attempt.note ? ` Observação: ${attempt.note}` : ""}</li>)}</ul> : <p className="mt-2 text-sm text-blue-900">Nenhuma solução foi marcada como tentada antes da abertura deste chamado.</p>}</div></DetailSection>}
    <TicketWorkflow ticket={activeTicket} onUpdate={setActiveTicket} />
    <DetailSection icon={Route} title="Caminho do diagnóstico"><DiagnosticPath steps={activeTicket.answers} result={{ title: activeTicket.title, description: activeTicket.description }} /></DetailSection>
  </div>;
}

function DetailSection({ icon: Icon, title, children }) { return <section><div className="mb-4 flex items-center gap-2"><Icon className="size-5 text-primary" /><h3 className="font-bold text-slate-950">{title}</h3></div>{children}</section>; }

function formatAttemptOutcome(outcome) { return ({ resolveu: "resolveu", "nao-resolveu": "não resolveu", "nao-sei": "ainda não sabe" })[outcome] || "foi registrada"; }
