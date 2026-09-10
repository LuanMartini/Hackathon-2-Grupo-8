"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, GitBranch, LayoutDashboard, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brand } from "@/components/Brand";
import { useSupportWebMcp } from "@/hooks/use-support-webmcp";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useDemoProfile } from "@/lib/demo-access";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";

const evidence = [
  ["42", "pessoas ouvidas"],
  ["66,7%", "explicam só em alguns casos"],
  ["57,1%", "recebem mais perguntas"],
];

const quickExamples = [
  "Não consigo emitir a nota fiscal",
  "O relatório abre sem os dados esperados",
  "Não recebi o e-mail de confirmação",
  "O cadastro não salva",
];

export default function Home() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const profile = useDemoProfile();
  useSupportWebMcp(router);

  function startDiagnosis() {
    const value = description.trim();
    if (!value) {
      setError("Conte brevemente o que aconteceu para começarmos.");
      return;
    }
    sessionStorage.setItem("support-diagnosis-input", value);
    const runId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem("support-diagnosis-run-id", runId);
    router.push(`/diagnostico?run=${encodeURIComponent(runId)}`);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <nav aria-label="Navegação principal" className="flex items-center gap-2">
            {profile?.role === "suporte" ? <Button variant="ghost" className="hidden text-slate-600 sm:inline-flex" onClick={() => router.push("/suporte")}><LayoutDashboard aria-hidden="true" className="size-4" />Painel do suporte</Button> : <Button variant="ghost" className="hidden text-slate-600 sm:inline-flex" onClick={() => router.push("/meus-chamados")}><Ticket aria-hidden="true" className="size-4" />Meus chamados</Button>}
            <AccessibilityMenu />
            <ProfileSwitcher compact />
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 md:inline-flex">
              MVP · dados demonstrativos
            </span>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_72%_18%,rgba(44,117,255,.14),transparent_34%),linear-gradient(180deg,#f7faff_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
              <Sparkles aria-hidden="true" className="size-4" />
              Você descreve. Nós organizamos.
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.07] tracking-[-.045em] text-slate-950 sm:text-5xl lg:text-[4rem]">
              Descubra o que está acontecendo.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Responda algumas perguntas e transforme seu problema em um chamado completo para o suporte.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              {["Perguntas simples", "Sem termos técnicos", "Chamado pronto em minutos"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="size-3.5" /></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,.12)] sm:p-8">
            <div className="absolute -right-3 -top-3 hidden size-24 rounded-3xl border border-blue-200/70 bg-blue-50/60 sm:block" />
            <div className="relative">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">NOVO DIAGNÓSTICO</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">O que aconteceu?</h2>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                  <GitBranch aria-hidden="true" className="size-5" />
                </span>
              </div>
              <label htmlFor="problem" className="mb-2 block text-sm font-semibold text-slate-700">Descreva do seu jeito</label>
              <Textarea
                id="problem"
                value={description}
                onChange={(event) => { setDescription(event.target.value); setError(""); }}
                onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") startDiagnosis(); }}
                placeholder="Ex.: Não consigo emitir a nota fiscal"
                className="min-h-36 resize-none rounded-2xl border-slate-200 bg-slate-50/70 p-4 text-base leading-7 shadow-inner shadow-slate-100 focus-visible:border-blue-400 focus-visible:ring-blue-200"
                aria-describedby={error ? "problem-error" : "problem-help"}
              />
              {error ? <p id="problem-error" role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p> : <p id="problem-help" className="mt-2 text-sm text-slate-500">Você não precisa saber explicar tecnicamente.</p>}
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">Para sua segurança, não envie senhas, códigos de confirmação, chaves de acesso, documentos ou dados financeiros.</p>
              <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Exemplos de temas</p><div className="mt-2 flex flex-wrap gap-2">{quickExamples.map((example) => <button key={example} type="button" onClick={() => { setDescription(example); setError(""); }} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{example}</button>)}</div></div>
              <Button onClick={startDiagnosis} size="lg" className="mt-6 h-13 w-full rounded-xl bg-primary text-base font-semibold shadow-[0_10px_28px_rgba(13,72,255,.25)] hover:bg-blue-700">
                Começar diagnóstico
                <ArrowRight aria-hidden="true" className="size-5" />
              </Button>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Dados salvos somente neste dispositivo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-3">
          {evidence.map(([value, label]) => (
            <div key={label} className="bg-slate-950 px-6 py-6 text-center sm:text-left lg:px-10">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
