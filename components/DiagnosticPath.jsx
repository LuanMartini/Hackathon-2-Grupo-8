import { ArrowDown, Check } from "lucide-react";

export function DiagnosticPath({ steps = [], result }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Problema inicial</p><p className="mt-1 font-semibold text-slate-900">{result?.description || "Relato informado"}</p></div>
      {steps.map((step, index) => (
        <div key={`${step.question}-${index}`}>
          <ArrowDown className="mx-auto my-2 size-4 text-slate-300" />
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">{step.displayedQuestion || step.question}</p>{step.baseQuestion && step.baseQuestion !== step.displayedQuestion && <p className="mt-1 text-xs leading-5 text-slate-400">Pergunta-base: {step.baseQuestion}</p>}<p className="mt-1 flex items-center gap-2 font-semibold text-slate-900"><Check className="size-4 text-emerald-600" />{step.answer}</p></div>
        </div>
      ))}
      {result && <><ArrowDown className="mx-auto my-2 size-4 text-primary" /><div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Resultado</p><p className="mt-1 font-bold text-blue-950">{result.title}</p></div></>}
    </div>
  );
}
