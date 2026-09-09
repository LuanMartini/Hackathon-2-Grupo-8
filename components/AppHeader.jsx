"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useDemoProfile } from "@/lib/demo-access";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";

export function AppHeader({ backHref = "/", backLabel = "Início" }) {
  const router = useRouter();
  const profile = useDemoProfile();
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <button className="rounded-xl text-left focus-visible:outline-2 focus-visible:outline-primary" onClick={() => router.push("/")} aria-label="Ir para o início"><Brand /></button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push(backHref)}><ArrowLeft className="size-4" />{backLabel}</Button>
          {profile?.role === "suporte" ? <Button variant="outline" className="hidden sm:inline-flex" onClick={() => router.push("/suporte")}><LayoutDashboard className="size-4" />Suporte</Button> : <Button variant="outline" className="hidden sm:inline-flex" onClick={() => router.push("/meus-chamados")}><Ticket className="size-4" />Meus chamados</Button>}
          <AccessibilityMenu />
          <ProfileSwitcher compact />
        </div>
      </div>
    </header>
  );
}
