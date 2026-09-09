"use client";

import { useEffect } from "react";

export function useSupportWebMcp(router) {
  useEffect(() => {
    const context = typeof document === "undefined" ? null : document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: "start_support_diagnosis",
        title: "Iniciar diagnóstico de suporte",
        description: "Inicia o diagnóstico guiado com a descrição fornecida e abre a primeira pergunta.",
        inputSchema: {
          type: "object",
          properties: { description: { type: "string", minLength: 3, description: "Descrição livre do problema relatado pelo usuário." } },
          required: ["description"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(input) {
          const description = typeof input?.description === "string" ? input.description.trim() : "";
          if (description.length < 3) throw new Error("A descrição precisa ter pelo menos 3 caracteres.");
          sessionStorage.setItem("support-diagnosis-input", description);
          router.push("/diagnostico");
          return { status: "started", description };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [router]);
}
