"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, FilePlus2, ImageUp, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { CauseProbability } from "@/components/CauseProbability";
import { SolutionRecommendations } from "@/components/SolutionRecommendations";
import { generateAIAnalysis, generatePossibleCauses, generateRecommendedActions } from "@/lib/ai";
import { createTicketFromResult, getSimilarTicketsForResult, saveTicket } from "@/lib/storage";
import { calculateTicketQuality } from "@/lib/ticket-helpers";
import { formatDuration } from "@/lib/diagnostic";
import { evaluateCaseAndRecommendSolution } from "@/data/solutionCatalog";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null); const [saveError, setSaveError] = useState(""); const [evidence, setEvidence] = useState(null); const [solutionAttempts, setSolutionAttempts] = useState([]); const [presentedSolutions, setPresentedSolutions] = useState([]);
  useEffect(() => { try { const raw = sessionStorage.getItem("support-diagnosis-result"); if (raw) setResult(JSON.parse(raw)); } catch { setResult(null); } }, []);
  const causes = useMemo(() => result ? generatePossibleCauses(result) : [], [result]);
  const analysis = useMemo(() => result ? generateAIAnalysis({ description: result.description, information: result.information, probableProblem: result.title, category: result.category }) : "", [result]);
  const actions = useMemo(() => result ? generateRecommendedActions(result.category, result) : [], [result]);
  const quality = useMemo(() => calculateTicketQuality(result, evidence), [result, evidence]);
  const similarTickets = useMemo(() => result ? getSimilarTicketsForResult(result) : [], [result]);
  const caseEvaluation = useMemo(() => result ? evaluateCaseAndRecommendSolution(result, solutionAttempts, { evidence }) : null, [result, solutionAttempts, evidence]);

  useEffect(() => {
    if (!caseEvaluation?.solutions?.length) return;
    setPresentedSolutions((current) => {
      const unseen = caseEvaluation.solutions.filter((solution) => !current.some((item) => item.id === solution.id));
      if (!unseen.length) return current;
      const presentedAt = new Date().toISOString();
      return [...current, ...unseen.map((solution, index) => ({ ...summarizeSolution(solution), recommended: current.length === 0 && index === 0, order: current.length + index + 1, presentedAt }))];
    });
  }, [caseEvaluation]);

  const recordSolutionAttempt = useCallback((attempt) => {
    setSolutionAttempts((current) => [...current.filter((item) => item.solutionId !== attempt.solutionId), attempt]);
  }, []);

  function handleEvidence(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setSaveError("Selecione uma imagem para usar como evidência.");
    if (file.size > 1_500_000) return setSaveError("Para este MVP, escolha uma imagem de até 1,5 MB.");
    const reader = new FileReader();
    reader.onload = () => { setEvidence({ name: file.name, type: file.type, preview: String(reader.result), size: file.size }); setSaveError(""); };
    reader.readAsDataURL(file);
  }

  function createTicket() {
    try {
      const ticket = createTicketFromResult(result, analysis, actions, {
        evidence, quality, similarTickets,
        recommendedSolution: presentedSolutions[0] || (caseEvaluation?.recommendedSolution ? summarizeSolution(caseEvaluation.recommendedSolution) : null),
        visibleSolutions: presentedSolutions,
        solutionAttempts,
        caseEvaluation: caseEvaluation ? { probableProblem: caseEvaluation.probableProblem, confidence: caseEvaluation.confidence, explanation: caseEvaluation.explanation, requiresSupport: caseEvaluation.requiresSupport, supportReason: caseEvaluation.supportReason, contextForTicket: caseEvaluation.contextForTicket } : null,
      });
      const saved = saveTicket(ticket);
      if (!saved.ok) return setSaveError(saved.error);
      sessionStorage.setItem("support-current-ticket", ticket.id); router.push("/chamado");
    } catch {
      setSaveError("Não conseguimos criar o chamado agora. Tente novamente em alguns instantes.");
    }
  }

  if (!result) return <main className="min-h-screen bg-slate-50"><AppHeader /><div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-bold">Ainda não há um resultado para mostrar</h1><p className="mt-2 text-slate-600">Comece um novo diagnóstico para que possamos organizar seu relato.</p><Button className="mt-6" onClick={() => router.push("/")}>Iniciar diagnóstico</Button></div></main>;
  return <main className="min-h-screen bg-slate-50"><AppHeader backHref="/diagnostico" backLabel="Diagnóstico" /><div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700"><CheckCircle2 className="size-4" />Diagnóstico concluído</div><h1 className="text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">Seu relato agora está completo.</h1></div><Button variant="outline" onClick={() => router.push("/")}><RotateCcw className="size-4" />Novo diagnóstico</Button></div>
    <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-6"><section className="overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,.18)] sm:p-8"><div className="flex flex-wrap gap-2"><Badge className="bg-blue-500 text-white">Problema mais provável</Badge><Badge variant="outline" className="border-white/15 text-slate-300">Estimativa demonstrativa</Badge></div><h2 className="mt-6 max-w-2xl text-2xl font-bold leading-tight tracking-[-.03em] sm:text-3xl">{result.title}</h2><div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4"><Metric label="Confiança" value={`${result.confidence}%`} /><Metric label="Categoria" value={result.category} /><Metric label="Prioridade" value={result.priority} /><Metric label="Duração" value={formatDuration(result.elapsedSeconds)} /></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-bold text-slate-950">Informações coletadas</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{result.information.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></section>
      <section className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><BrainCircuit className="size-5" /></span><div><h2 className="font-bold text-slate-950">Análise inteligente</h2><p className="text-xs text-slate-500">Gerada por regras do MVP</p></div></div><p className="mt-5 leading-7 text-slate-700">{analysis}</p></section></div>
      <aside className="space-y-6"><section><h2 className="mb-4 font-bold text-slate-950">Hipóteses de causa</h2><div className="space-y-3">{causes.map((cause, index) => <CauseProbability key={cause.name} cause={cause} index={index} />)}</div></section>
        {result.treeId === "reports" && <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="font-bold text-blue-950">O que ajuda o suporte a investigar</h2><p className="mt-2 text-sm leading-6 text-blue-900">Seu relato já ajuda bastante. Se puder, informe o período, os filtros usados, a empresa ou filial e a mensagem exibida. Uma imagem também pode acelerar a análise.</p></section>}
        <SolutionRecommendations evaluation={caseEvaluation} onAttemptRecorded={recordSolutionAttempt} onOpenTicket={createTicket} />
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Sparkles className="size-4 text-primary" />Qualidade do relato</div><p className="mt-3 text-xl font-bold text-slate-950">{quality.label} · {quality.score}%</p>{quality.missing.length ? <p className="mt-2 text-sm leading-6 text-slate-500">Para enriquecer o chamado, você pode incluir: {quality.missing.join(", ")}.</p> : <p className="mt-2 text-sm text-emerald-700">O relato já está pronto para a triagem.</p>}</section>
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-5"><div className="flex items-center gap-2 font-semibold text-slate-700"><ImageUp className="size-5 text-primary" />Imagem do erro</div><p className="mt-2 text-sm leading-6 text-slate-500">Opcional. Nome, tipo e prévia ficam somente neste navegador.</p><p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">Não envie senhas, códigos de confirmação, chaves de acesso, documentos ou dados financeiros.</p><label className="mt-4 inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><input type="file" accept="image/*" className="sr-only" onChange={handleEvidence} />Escolher imagem</label>{evidence && <div className="mt-4 flex gap-3"><img src={evidence.preview} alt="Prévia da imagem anexada" className="size-14 rounded-lg border border-slate-200 object-cover" /><p className="text-sm font-medium text-slate-700">{evidence.name}</p></div>}</section>
        {similarTickets.length > 0 && <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold text-amber-950">Encontramos chamados parecidos</h2><p className="mt-1 text-sm leading-6 text-amber-800">Há casos em andamento com tema semelhante. Você ainda pode criar seu chamado.</p><div className="mt-3 space-y-2">{similarTickets.map((ticket) => <div key={ticket.id} className="rounded-xl bg-white/80 p-3"><p className="text-sm font-semibold text-slate-800">{ticket.title}</p><p className="mt-1 text-xs text-slate-500">{ticket.category} · {ticket.status}</p></div>)}</div></section>}
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Clock3 className="size-4" />Próximos passos já preparados</div><p className="mt-3 text-sm leading-6 text-slate-500">O chamado levará o diagnóstico, as respostas, hipóteses e verificações recomendadas.</p></section>{saveError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{saveError}</p>}<Button size="lg" onClick={createTicket} className="h-14 w-full rounded-xl text-base shadow-[0_12px_30px_rgba(13,72,255,.25)]"><FilePlus2 className="size-5" />Criar chamado para o suporte<ArrowRight className="size-5" /></Button><p className="flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-4" />Salvo neste dispositivo</p></aside></div></div></main>;
}

function Metric({ label, value }) { return <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 font-bold text-white">{value}</p></div>; }

function summarizeSolution(solution) {
  return { id: solution.id, title: solution.title, category: solution.category, recommended: solution.recommended, steps: solution.steps };
}
