import { BrainCircuit, CheckCircle2, ClipboardList, Route, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CauseProbability } from "@/components/CauseProbability";
import { DiagnosticPath } from "@/components/DiagnosticPath";

export function TicketDetail({ ticket }) {
  if (!ticket) return null;
  const causes = ticket.causes.map(([name, probability]) => ({ name, probability }));
  return (
    <div className="space-y-7 pb-8">
      <section className="rounded-2xl bg-slate-950 p-5 text-white">
        <div className="flex flex-wrap items-center gap-2"><Badge className="bg-blue-500 text-white">{ticket.id}</Badge><Badge variant="outline" className="border-white/20 text-slate-200">{ticket.status}</Badge></div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">{ticket.title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{ticket.description}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-sm"><div><p className="text-slate-400">Categoria</p><p className="mt-1 font-semibold">{ticket.category}</p></div><div><p className="text-slate-400">Prioridade</p><p className="mt-1 font-semibold">{ticket.priority}</p></div><div><p className="text-slate-400">Confiança</p><p className="mt-1 font-semibold">{ticket.confidence}%</p></div></div>
      </section>

      <DetailSection icon={UserRound} title="Usuário afetado"><p className="font-semibold text-slate-900">{ticket.user.name}</p><p className="text-sm text-slate-500">{ticket.user.role} · versão {ticket.user.version}</p></DetailSection>
      <DetailSection icon={ClipboardList} title="Informações coletadas"><ul className="space-y-2">{ticket.information.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></DetailSection>
      <DetailSection icon={BrainCircuit} title="Análise inteligente"><p className="text-sm leading-6 text-slate-600">{ticket.analysis}</p><p className="mt-3 text-xs font-medium text-slate-400">Análise demonstrativa · regras do MVP</p></DetailSection>
      <DetailSection icon={CheckCircle2} title="Possíveis causas"><div className="space-y-3">{causes.map((cause, index) => <CauseProbability key={cause.name} cause={cause} index={index} />)}</div></DetailSection>
      <DetailSection icon={ClipboardList} title="Próximas verificações"><ol className="space-y-3">{ticket.actions.map((action, index) => <li key={action} className="flex gap-3 text-sm text-slate-700"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-primary">{index + 1}</span><span className="pt-0.5">{action}</span></li>)}</ol></DetailSection>
      <DetailSection icon={Route} title="Caminho do diagnóstico"><DiagnosticPath steps={ticket.answers} result={{ title: ticket.title, description: ticket.description }} /></DetailSection>
    </div>
  );
}

function DetailSection({ icon: Icon, title, children }) {
  return <section><div className="mb-4 flex items-center gap-2"><Icon className="size-5 text-primary" /><h3 className="font-bold text-slate-950">{title}</h3></div>{children}</section>;
}
