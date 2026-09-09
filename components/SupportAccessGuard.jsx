"use client";

import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { isSupportProfile, useDemoProfile } from "@/lib/demo-access";

export function SupportAccessGuard({ children }) {
  const router = useRouter();
  const profile = useDemoProfile();
  if (!profile) return <main className="grid min-h-screen place-items-center bg-slate-50"><p className="text-sm text-slate-500">Verificando perfil da demonstração…</p></main>;
  if (isSupportProfile(profile)) return children;
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(13,72,255,.1),transparent_28rem)] px-5">
      <section className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_24px_70px_rgba(15,23,42,.12)] sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-700"><ShieldAlert className="size-7" /></span>
        <p className="mt-6 text-sm font-bold text-red-700">ACESSO RESTRITO</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">A Central de Suporte é exclusiva da equipe.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">O perfil de usuário pode criar e acompanhar apenas os próprios chamados. Métricas, insights e chamados de outras pessoas ficam indisponíveis neste modo.</p>
        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-amber-700" /><p className="text-sm leading-6 text-amber-900">Proteção demonstrativa: o perfil é local. Em produção, a autorização precisa ser validada por uma API e pelo servidor.</p></div></div>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"><Button onClick={() => router.push("/meus-chamados")}>Ver meus chamados</Button><ProfileSwitcher /></div>
      </section>
    </main>
  );
}
