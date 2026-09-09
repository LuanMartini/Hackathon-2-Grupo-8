import { Lightbulb } from "lucide-react";

const tones = { blue: "bg-blue-50 text-blue-700", amber: "bg-amber-50 text-amber-700", violet: "bg-violet-50 text-violet-700", teal: "bg-teal-50 text-teal-700" };

export function InsightCard({ insight }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid size-10 place-items-center rounded-xl ${tones[insight.tone]}`}><Lightbulb className="size-5" /></span><h3 className="mt-5 font-bold text-slate-950">{insight.title}</h3><p className="mt-2 leading-6 text-slate-600">{insight.text}</p></article>;
}
