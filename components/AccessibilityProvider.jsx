"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AccessibilityContext = createContext(null);
const STORAGE_KEY = "support-clear-accessibility-v1";
const defaults = { theme: "system", fontSize: "standard", highContrast: false, grayscaleMode: false };

function readPreferences() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return defaults; }
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { setPreferences(readPreferences()); setReady(true); }, []);
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const applyTheme = () => {
      const resolvedTheme = preferences.theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preferences.theme;
      root.dataset.theme = resolvedTheme;
    };
    applyTheme();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    root.classList.toggle("font-size-small", preferences.fontSize === "small");
    root.classList.toggle("font-size-standard", preferences.fontSize === "standard");
    root.classList.toggle("font-size-large", preferences.fontSize === "large");
    root.classList.toggle("high-contrast", preferences.highContrast);
    root.classList.toggle("grayscale-mode", preferences.grayscaleMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return () => media.removeEventListener("change", applyTheme);
  }, [preferences, ready]);
  const value = useMemo(() => ({ preferences, setPreferences, reset: () => setPreferences(defaults) }), [preferences]);
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityPreferences() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibilityPreferences deve ser usado dentro de AccessibilityProvider.");
  return context;
}

// As preferências são salvas localmente neste navegador e não representam um perfil de acessibilidade em produção.
