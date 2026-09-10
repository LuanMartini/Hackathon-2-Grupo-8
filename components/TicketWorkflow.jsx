"use client";

import { useState } from "react";
import { CheckCircle2, ImageIcon, MessageCircleMore, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoProfile } from "@/lib/demo-access";
import { addTicketComment, saveTicketEvaluation, updateTicketStatus } from "@/lib/storage";

const statuses = ["Aberto", "Em análise", "Aguardando informação", "Resolvido"];
const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "";

export function TicketWorkflow({ ticket, onUpdate }) {
  const profile = useDemoProfile();
  const [comment, setComment] = useState("");
  const [requestDetails, setRequestDetails] = useState(false);
  const [evaluation, setEvaluation] = useState(ticket.evaluation?.resolved ?? null);
  const [evaluationText, setEvaluationText] = useState(ticket.evaluation?.comment || "");
  const [feedback, setFeedback] = useState(null);
  const isSupport = profile?.role === "suporte";
  const ownsTicket = profile?.id === ticket.userId;

  function apply(result, successMessage) { if (!result.ok) return setFeedback({ type: "error", text: result.error }); setFeedback(successMessage ? { type: "success", text: successMessage } : null); onUpdate?.(result.ticket); }
  function sendComment() { const shouldRequestDetails = requestDetails; apply(addTicketComment(ticket.id, comment, shouldRequestDetails), shouldRequestDetails ? "Mensagem enviada. O chamado agora aguarda uma resposta." : "Mensagem enviada para o chamado."); setComment(""); setRequestDetails(false); }
  function changeStatus(status) { apply(updateTicketStatus(ticket.id, status), `Status atualizado para ${status}.`); }
  function sendEvaluation() { if (evaluation === null) return setFeedback({ type: "error", text: "Conte para nós se o problema foi resolvido antes de enviar a avaliação." }); apply(saveTicketEvaluation(ticket.id, evaluation, evaluationText), "Obrigado pela sua avaliação."); }

  return <div className="space-y-7">
    {feedback && <p role={feedback.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl border p-3 text-sm font-medium ${feedback.type === "error" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{feedback.text}</p>}
    {isSupport && <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-slate-950">Status do chamado</p><p className="mt-1 text-sm text-slate-500">A alteração é registrada no histórico.</p></div><select value={ticket.status} onChange={(event) => changeStatus(event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></section>}

    <section><div className="mb-4 flex items-center gap-2"><MessageCircleMore className="size-5 text-primary" /><h3 className="font-bold text-slate-950">Conversa do chamado</h3></div><div className="space-y-3">{ticket.comments?.length ? ticket.comments.map((item) => <div key={item.id} className={`rounded-2xl border p-4 ${item.role === "suporte" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-slate-900">{item.author} <span className="font-normal text-slate-500">· {item.role === "suporte" ? "Suporte" : "Usuário"}</span></p><p className="text-xs text-slate-400">{formatDate(item.at)}</p></div><p className="mt-2 text-sm leading-6 text-slate-700">{item.content}</p></div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Ainda não há mensagens. Se precisar complementar algo, envie um comentário abaixo.</p>}</div>
      {(isSupport || ownsTicket) && <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"><label className="text-sm font-semibold text-slate-700" htmlFor={`comment-${ticket.id}`}>Adicionar comentário</label><textarea id={`comment-${ticket.id}`} value={comment} onChange={(event) => setComment(event.target.value)} placeholder={isSupport ? "Oriente a próxima verificação ou solicite um detalhe." : "Compartilhe a informação solicitada pela equipe."} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />{isSupport && <label className="mt-3 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={requestDetails} onChange={(event) => setRequestDetails(event.target.checked)} />Solicitar mais informações e aguardar resposta</label>}<Button size="sm" className="mt-3" onClick={sendComment}><Send className="size-4" />Enviar comentário</Button></div>}</section>

    {ticket.evidence && <section><div className="mb-4 flex items-center gap-2"><ImageIcon className="size-5 text-primary" /><h3 className="font-bold text-slate-950">Evidência anexada</h3></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap gap-4">{ticket.evidence.preview && <img src={ticket.evidence.preview} alt="Prévia da evidência enviada" className="h-28 w-40 rounded-xl border border-slate-200 object-cover" />}<div><p className="font-semibold text-slate-900">{ticket.evidence.name}</p><p className="mt-1 text-sm text-slate-500">{ticket.evidence.type || "Imagem"} · guardada apenas neste navegador</p><p className="mt-3 text-xs leading-5 text-slate-500"><ShieldAlert className="mr-1 inline size-3.5" />Em produção, arquivos devem ser enviados para armazenamento seguro no backend.</p></div></div></div></section>}

    {ticket.statusHistory?.length > 0 && <section><h3 className="mb-3 font-bold text-slate-950">Histórico de status</h3><div className="space-y-2">{ticket.statusHistory.slice().reverse().map((item, index) => <p key={`${item.at}-${index}`} className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{item.status}</span> · {item.author} · {formatDate(item.at)}</p>)}</div></section>}

    {ticket.status === "Resolvido" && ownsTicket && !ticket.evaluation && <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-700" /><h3 className="font-bold text-emerald-950">O problema foi resolvido?</h3></div><div className="mt-4 flex gap-2"><Button type="button" variant={evaluation === true ? "default" : "outline"} onClick={() => setEvaluation(true)}>Sim</Button><Button type="button" variant={evaluation === false ? "default" : "outline"} onClick={() => setEvaluation(false)}>Não</Button></div><textarea value={evaluationText} onChange={(event) => setEvaluationText(event.target.value)} placeholder="Comentário opcional" className="mt-3 min-h-20 w-full rounded-xl border border-emerald-200 bg-white p-3 text-sm outline-none" /><Button size="sm" className="mt-3 bg-emerald-700 hover:bg-emerald-800" onClick={sendEvaluation}>Enviar avaliação</Button></section>}
    {ticket.evaluation && <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-bold text-emerald-950">Avaliação: {ticket.evaluation.resolved ? "problema resolvido" : "problema não resolvido"}</p>{ticket.evaluation.comment && <p className="mt-2 text-sm text-emerald-900">{ticket.evaluation.comment}</p>}</section>}
  </div>;
}
