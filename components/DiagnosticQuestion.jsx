import { ArrowRight, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DiagnosticQuestion({ node, onAnswer }) {
  return (
    <section key={node.id} className="animate-rise rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,.09)] sm:p-9">
      <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-blue-50 text-primary"><CircleHelp className="size-6" /></span>
      <h1 className="max-w-2xl text-2xl font-bold leading-tight tracking-[-.03em] text-slate-950 sm:text-3xl">{node.question}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{node.hint || "Escolha a opção que mais se aproxima do que aconteceu."}</p>
      <div className="mt-8 grid gap-3" role="group" aria-label="Opções de resposta">
        {node.answers.map((answer) => (
          <Button key={answer.id} variant="outline" onClick={() => onAnswer(answer.id)} className="group h-auto min-h-15 justify-between rounded-2xl border-slate-200 bg-white px-5 py-4 text-left text-base font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">
            <span className="min-w-0 whitespace-normal"><span className="block">{answer.label}</span>{answer.description && <span className="mt-1 block text-sm font-normal leading-5 text-slate-500 group-hover:text-blue-700">{answer.description}</span>}</span>
            <ArrowRight className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary" />
          </Button>
        ))}
      </div>
    </section>
  );
}
