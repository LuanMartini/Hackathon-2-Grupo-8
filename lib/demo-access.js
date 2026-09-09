"use client";

import { useEffect, useState } from "react";

const PROFILE_KEY = "support-clear-demo-profile-v1";

export const demoProfiles = {
  usuario: { id: "usr-marina-costa", role: "usuario", name: "Marina Costa", label: "Usuário" },
  suporte: { id: "sup-julia-alves", role: "suporte", name: "Júlia Alves", label: "Profissional de suporte" },
};

export function getDemoProfile() {
  if (typeof window === "undefined") return null;
  try {
    const selected = localStorage.getItem(PROFILE_KEY);
    return demoProfiles[selected] || demoProfiles.usuario;
  } catch {
    return demoProfiles.usuario;
  }
}

export function setDemoProfile(role) {
  if (!demoProfiles[role]) return false;
  try {
    localStorage.setItem(PROFILE_KEY, role);
    window.dispatchEvent(new Event("support-clear-profile-change"));
    return true;
  } catch {
    return false;
  }
}

export function useDemoProfile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const update = () => setProfile(getDemoProfile());
    update();
    window.addEventListener("support-clear-profile-change", update);
    return () => window.removeEventListener("support-clear-profile-change", update);
  }, []);
  return profile;
}

export function isSupportProfile(profile = getDemoProfile()) {
  return profile?.role === "suporte";
}

// IMPORTANTE: este arquivo representa apenas um perfil de demonstração.
// Em produção, identidade e autorização devem ser verificadas no servidor.
