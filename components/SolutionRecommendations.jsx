"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const outcomeLabels = {
  resolveu: "Tentei e resolveu",
  "nao-resolveu": "Tentei e não resolveu",
  "nao-consegui": "Não consegui tentar",
};

export function SolutionRecommendations({ evaluation, onAttemptRecorded, onOpenTicket }) {
  const [tryingSolutionId, setTryingSolutionId] = useState("");
  const [message, setMessage] = useState("");
  const [attemptNote, setAttemptNote] = useState("");
  const solutions = evaluation?.solutions || [];

  function chooseOutcome(solution, outcome) {
    onAttemptRecorded({ solutionId: solution.id, title: solution.title, outcome, note: attemptNote.trim(), at: new Date().toISOString() });
    setTryingSolutionId("");
    setAttemptNote("");
    setMessage(outcome === "resolveu"
      ? "Que bom! Se o problema voltar, você ainda poderá abrir um chamado com este diagnóstico."
      : outcome === "nao-resolveu"
        ? "Tudo bem. Vamos mostrar a próxima opção segura, se houver uma."
        : "Sem problema. Você pode abrir um chamado com o contexto já reunido.");
  }

  if (!evaluation) return null;
  if (!solutions.length) return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold text-amber-950">O que você pode fazer agora</h2><p className="mt-2 text-sm leading-6 text-amber-900">{evaluation.explanation}</p><p className="mt-3 text-sm leading-6 text-amber-900">{evaluation.supportReason}</p><Button className="mt-4" onClick={onOpenTicket}>Abrir chamado com essas informações</Button></section>;

  const [recommended, ...alternatives] = solutions;
  return <section aria-labelledby="solutions-heading" className="space-y-4"><div><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Lightbulb className="size-4 text-primary" />O que você pode fazer agora</div><h2 id="solutions-heading" className="mt-1 font-bold text-slate-950">{evaluation.explanation}</h2></div>
    <SolutionCard solution={recommended} featured trying={tryingSolutionId === recommended.id} onTry={() => { setAttemptNote(""); setTryingSolutionId(recommended.id); }} onOutcome={chooseOutcome} note={attemptNote} onNoteChange={setAttemptNote} />
    {alternatives.length > 0 && <div><h3 className="mb-3 text-sm font-bold text-slate-800">Outras opções seguras</h3><div className="space-y-3">{alternatives.map((solution) => <SolutionCard key={solution.id} solution={solution} trying={tryingSolutionId === solution.id} onTry={() => { setAttemptNote(""); setTryingSolutionId(solution.id); }} onOutcome={chooseOutcome} note={attemptNote} onNoteChange={setAttemptNote} />)}</div></div>}
    <p aria-live="polite" className={message ? "rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-900" : "sr-only"}>{message}</p>
    <div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="font-semibold text-slate-950">Ainda precisa de ajuda?</h3><p className="mt-1 text-sm leading-6 text-slate-600">Não se preocupe. O suporte receberá o diagnóstico e tudo o que você já tentou, para evitar que você precise explicar o mesmo problema novamente.</p><Button variant="outline" size="sm" className="mt-3" onClick={onOpenTicket}>Abrir chamado com essas informações</Button></div>
  </section>;
}

function SolutionCard({ solution, featured = false, trying, onTry, onOutcome, note, onNoteChange }) {
  return <article className={`rounded-2xl border p-5 ${featured ? "border-primary bg-blue-50/70 shadow-sm" : "border-slate-200 bg-white"}`}>
    {featured && <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white"><CheckCircle2 className="size-3.5" />Melhor opção para começar</p>}
    <h3 className="font-bold text-slate-950">{solution.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{solution.whenToUse}</p>
    <ol className="mt-4 space-y-2">{solution.steps.map((step, index) => <li key={step} className="flex gap-2 text-sm leading-5 text-slate-700"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-primary ring-1 ring-blue-100">{index + 1}</span>{step}</li>)}</ol>
    <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0" />{solution.safetyNote}</p>
    {!trying ? <Button variant={featured ? "default" : "outline"} size="sm" className="mt-4" onClick={onTry}>Tentei esta solução</Button> : <div className="mt-4 rounded-xl border border-blue-200 bg-white p-3"><label className="block text-sm font-semibold text-slate-800" htmlFor={`attempt-note-${solution.id}`}>Como foi a tentativa?</label><input id={`attempt-note-${solution.id}`} value={note} maxLength={240} onChange={(event) => onNoteChange(event.target.value)} placeholder="Observação opcional, sem dados sensíveis" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800" /><div className="mt-3 flex flex-wrap gap-2">{Object.entries(outcomeLabels).map(([outcome, label]) => <Button key={outcome} size="sm" variant="outline" onClick={() => onOutcome(solution, outcome)}>{label}</Button>)}</div></div>}
  </article>;
}
