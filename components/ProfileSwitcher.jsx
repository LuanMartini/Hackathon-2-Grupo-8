"use client";

import { ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoProfiles, setDemoProfile, useDemoProfile } from "@/lib/demo-access";

export function ProfileSwitcher({ compact = false }) {
  const profile = useDemoProfile();
  return (
    <div className="flex items-center gap-2">
      {!compact && <ShieldCheck aria-hidden="true" className="size-4 text-slate-400" />}
      <Select value={profile?.role || "usuario"} onValueChange={setDemoProfile}>
        <SelectTrigger aria-label="Perfil de demonstração" className="h-9 min-w-35 border-slate-200 bg-white text-xs font-semibold text-slate-700"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="usuario">Usuário</SelectItem>
          <SelectItem value="suporte">Suporte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
