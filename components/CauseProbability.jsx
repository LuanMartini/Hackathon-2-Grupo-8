import { Progress } from "@/components/ui/progress";

export function CauseProbability({ cause, index }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{index + 1}</span><span className="font-semibold text-slate-800">{cause.name}</span></div>
        <span className="font-bold text-slate-950">{cause.probability}%</span>
      </div>
      <Progress value={cause.probability} className="h-2 bg-blue-100" />
    </div>
  );
}
