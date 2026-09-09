"use client";

import { useRef, useState } from "react";
import { Accessibility, Contrast, Moon, RotateCcw, Sun, TextCursorInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAccessibilityPreferences } from "@/components/AccessibilityProvider";

const themeOptions = [{ id: "light", label: "Claro", icon: Sun }, { id: "dark", label: "Escuro", icon: Moon }, { id: "system", label: "Seguir sistema", icon: Contrast }];
const fontOptions = [{ id: "small", label: "A-" }, { id: "standard", label: "A" }, { id: "large", label: "A+" }];

export function AccessibilityMenu() {
  const { preferences, setPreferences, reset } = useAccessibilityPreferences();
  const [open, setOpen] = useState(false); const triggerRef = useRef(null);
  const update = (patch) => setPreferences((current) => ({ ...current, ...patch }));
  function close(openValue) { setOpen(openValue); if (!openValue) requestAnimationFrame(() => triggerRef.current?.focus()); }
  return <Sheet open={open} onOpenChange={close}><SheetTrigger asChild><Button ref={triggerRef} variant="outline" size="icon" aria-label="Abrir opções de acessibilidade" title="Acessibilidade"><Accessibility className="size-4" /></Button></SheetTrigger><SheetContent className="w-full overflow-y-auto sm:max-w-md"><SheetHeader><SheetTitle>Opções de acessibilidade</SheetTitle><SheetDescription>As escolhas ficam salvas somente neste navegador.</SheetDescription></SheetHeader><div className="mt-7 space-y-7">
    <section><div className="flex items-center gap-2"><Sun className="size-4 text-primary" /><h3 className="font-bold text-slate-950">Tema</h3></div><div className="mt-3 grid gap-2">{themeOptions.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => update({ theme: id })} aria-pressed={preferences.theme === id} className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-semibold transition ${preferences.theme === id ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><span className="flex items-center gap-2"><Icon className="size-4" />{label}</span><span aria-hidden="true">{preferences.theme === id ? "Selecionado" : ""}</span></button>)}</div></section>
    <section><div className="flex items-center gap-2"><TextCursorInput className="size-4 text-primary" /><h3 className="font-bold text-slate-950">Tamanho da fonte</h3></div><div className="mt-3 grid grid-cols-3 gap-2">{fontOptions.map(({ id, label }) => <button key={id} type="button" onClick={() => update({ fontSize: id })} aria-pressed={preferences.fontSize === id} className={`rounded-xl border px-3 py-3 font-bold transition ${preferences.fontSize === id ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><span aria-hidden="true">{label}</span><span className="sr-only">{id === "small" ? "Diminuir fonte" : id === "large" ? "Aumentar fonte" : "Fonte padrão"}</span></button>)}</div></section>
    <section><div className="flex items-center gap-2"><Contrast className="size-4 text-primary" /><h3 className="font-bold text-slate-950">Alto contraste</h3></div><label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700"><span>Destacar textos, bordas e foco</span><input type="checkbox" checked={preferences.highContrast} onChange={(event) => update({ highContrast: event.target.checked })} aria-label="Ativar alto contraste" className="size-5 accent-blue-700" /></label></section>
    <Button variant="outline" className="w-full" onClick={reset}><RotateCcw className="size-4" />Restaurar padrão</Button><p aria-live="polite" className="text-xs leading-5 text-slate-500">Tema: {preferences.theme === "system" ? "seguir sistema" : preferences.theme === "dark" ? "escuro" : "claro"}. Fonte: {preferences.fontSize === "small" ? "pequena" : preferences.fontSize === "large" ? "grande" : "padrão"}.</p>
  </div></SheetContent></Sheet>;
}
