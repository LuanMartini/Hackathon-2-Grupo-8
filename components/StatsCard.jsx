export function StatsCard({ icon: Icon, label, value, note }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-primary"><Icon className="size-5" /></span>{note && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{note}</span>}</div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </article>
  );
}
