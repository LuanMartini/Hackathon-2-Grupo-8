"use client";

import { DatabaseZap, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDemoProfile } from "@/lib/demo-access";

export function SecurityMvpCard() {
  const profile = useDemoProfile();
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white"><ShieldCheck className="size-5" /></span><div><p className="text-sm font-bold text-blue-900">Segurança do MVP</p><p className="mt-1 text-sm text-blue-800">Perfil atual: <strong>{profile?.label || "Carregando"}</strong>.</p></div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-3"><SecurityItem title="Rotas protegidas" text="Central, chamados, métricas e insights exigem o perfil de suporte." /><SecurityItem title="Chamados isolados" text="O perfil de usuário carrega somente tickets vinculados ao próprio userId." /><SecurityItem title="Limitação conhecida" text="localStorage pode ser alterado pelo navegador; não é segurança real." /></div>
      <Alert className="mt-4 border-blue-200 bg-white"><DatabaseZap /><AlertTitle>Próxima etapa para produção</AlertTitle><AlertDescription>Usar autenticação, API e autorização no servidor, validando a propriedade do chamado em cada consulta.</AlertDescription></Alert>
    </section>
  );
}

function SecurityItem({ title, text }) { return <div className="rounded-xl border border-blue-100 bg-white p-3"><p className="text-sm font-bold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{text}</p></div>; }
