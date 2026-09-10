import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from "@/lib/diagnostic";

const priorityStyle = { Alta: "border-red-200 bg-red-50 text-red-700", Média: "border-amber-200 bg-amber-50 text-amber-700", Baixa: "border-slate-200 bg-slate-50 text-slate-600" };
const statusStyle = { Aberto: "bg-blue-50 text-blue-700", "Em análise": "bg-violet-50 text-violet-700", "Aguardando informação": "bg-amber-50 text-amber-700", Resolvido: "bg-emerald-50 text-emerald-700" };

export function TicketTable({ tickets, onSelect, limit }) {
  const visible = limit ? tickets.slice(0, limit) : tickets;
  return (
    <div className="overflow-x-auto" tabIndex={0} aria-label="Tabela de chamados. Deslize horizontalmente em telas menores para ver todas as colunas.">
    <Table>
      <TableHeader><TableRow className="hover:bg-transparent"><TableHead>ID</TableHead><TableHead>Problema</TableHead><TableHead>Categoria</TableHead><TableHead>Prioridade</TableHead><TableHead>Causa provável</TableHead><TableHead>Confiança</TableHead><TableHead>Status</TableHead><TableHead>Tempo</TableHead></TableRow></TableHeader>
      <TableBody>
        {visible.map((ticket) => (
          <TableRow key={ticket.id} tabIndex={onSelect ? 0 : undefined} aria-label={onSelect ? `Abrir detalhes do chamado ${ticket.id}: ${ticket.title}` : undefined} onClick={() => onSelect?.(ticket)} onKeyDown={(event) => { if (onSelect && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(ticket); } }} className={onSelect ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary" : ""}>
            <TableCell className="font-bold text-primary">{ticket.id}</TableCell>
            <TableCell className="max-w-60 truncate font-semibold text-slate-900">{ticket.title}</TableCell>
            <TableCell className="text-slate-600">{ticket.category}</TableCell>
            <TableCell><Badge variant="outline" className={priorityStyle[ticket.priority]}>{ticket.priority}</Badge></TableCell>
            <TableCell className="max-w-48 truncate text-slate-600">{ticket.probableCause}</TableCell>
            <TableCell className="font-semibold">{ticket.confidence}%</TableCell>
            <TableCell><Badge className={`border-0 ${statusStyle[ticket.status] || statusStyle.Aberto}`}>{ticket.status}</Badge></TableCell>
            <TableCell className="text-slate-500">{formatDuration(ticket.elapsedSeconds)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
