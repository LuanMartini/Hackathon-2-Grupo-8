import { Braces } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(13,72,255,.2)]">
        <Braces aria-hidden="true" className="size-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-[-.02em] text-slate-950">Suporte Claro</p>
          <p className="text-xs text-slate-500">Diagnóstico guiado</p>
        </div>
      )}
    </div>
  );
}
