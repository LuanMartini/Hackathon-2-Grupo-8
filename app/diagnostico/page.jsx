"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/AppHeader";
import { DiagnosticQuestion } from "@/components/DiagnosticQuestion";
import { diagnosticTrees, problemLabels } from "@/data/diagnosticTrees";
import { adaptQuestionToContext, answerDiagnostic, buildDiagnosisResult, createDiagnosticState, replayDiagnostic } from "@/lib/diagnostic";

export default function DiagnosisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  const runId = searchParams.get("run");

  useEffect(() => {
    const description = sessionStorage.getItem("support-diagnosis-input");
    if (!description) return;
    setState(null);
    setError("");
    try { setState(createDiagnosticState(description)); } catch { setError("Não conseguimos iniciar o diagnóstico agora. Volte ao início e tente novamente."); }
  }, [runId]);

  const tree = state ? diagnosticTrees[state.treeId] : null;
  const node = tree?.nodes?.[state.nodeId];
  const displayedNode = node && state ? { ...node, question: adaptQuestionToContext(node.question, state.description, tree.id) } : node;
  const progress = state && tree ? Math.min(92, ((state.path.length + 1) / tree.maxQuestions) * 100) : 0;
  const remaining = state && tree ? Math.max(1, tree.maxQuestions - state.path.length - 1) : 0;
  const labels = useMemo(() => (state?.possibilities || []).map((item) => problemLabels[item] || item), [state]);

  function answer(answerId) {
    try {
      const outcome = answerDiagnostic(tree, state, answerId);
      if (outcome.done) {
        const result = buildDiagnosisResult(tree, outcome.state, outcome.resultId);
        sessionStorage.setItem("support-diagnosis-result", JSON.stringify(result));
        router.push("/resultado");
      } else setState(outcome.state);
    } catch (exception) { setError(exception.message); }
  }

  function goBack() {
    if (!state.path.length) return router.push("/");
    try { setState(replayDiagnostic(state.description, state.treeId, state.path.slice(0, -1)).state); } catch (exception) { setError(exception.message); }
  }

  function restart() {
    if (state) setState(createDiagnosticState(state.description));
  }

  if (!state || !tree || !node) return (
    <main className="min-h-screen bg-slate-50"><AppHeader /><div className="mx-auto max-w-xl px-5 py-24 text-center"><AlertCircle className="mx-auto size-10 text-amber-500" /><h1 className="mt-4 text-2xl font-bold text-slate-950">Diagnóstico não iniciado</h1><p className="mt-2 text-slate-600">Volte ao início e descreva o que aconteceu.</p><Button className="mt-6" onClick={() => router.push("/")}>Ir para o início</Button></div></main>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(13,72,255,.08),transparent_32rem)]"><AppHeader backHref="/" backLabel="Início" />
      <div className="mx-auto max-w-4xl px-5 py-9 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" />Vamos entender o que aconteceu</div><p className="max-w-xl text-sm leading-6 text-slate-500">Relato: “{state.description}”</p></div>
          <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={goBack}><ArrowLeft className="size-4" />Voltar</Button><Button variant="ghost" size="sm" onClick={restart}><RotateCcw className="size-4" />Reiniciar</Button></div>
        </div>
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-semibold text-slate-700">Pergunta {state.path.length + 1} de aproximadamente {tree.maxQuestions}</span><span className="text-slate-500">cerca de {remaining} {remaining === 1 ? "pergunta restante" : "perguntas restantes"}</span></div><Progress value={progress} className="h-2" />
        </div>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
        <DiagnosticQuestion node={displayedNode} onAnswer={answer} />
        <div className="mt-6 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">Hipóteses em análise</span>{labels.map((label) => <span key={label} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">{label}</span>)}</div>
      </div>
    </main>
  );
}
