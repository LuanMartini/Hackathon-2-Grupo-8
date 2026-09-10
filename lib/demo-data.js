const LOCAL_KEYS = [
  "support-clear-tickets-v1",
  "support-clear-demo-profile-v1",
  "support-clear-accessibility-v1",
];

const SESSION_KEYS = [
  "support-diagnosis-input",
  "support-diagnosis-run-id",
  "support-diagnosis-result",
  "support-current-ticket",
];

// Recurso de teste: limpa somente informações produzidas pela demonstração neste navegador.
// Dados mockados permanecem no código e nunca são removidos por esta ação.
export function resetDemoData() {
  if (typeof window === "undefined") return false;
  try {
    LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
    SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    window.dispatchEvent(new Event("support-tickets-updated"));
    window.dispatchEvent(new Event("support-clear-profile-change"));
    return true;
  } catch {
    return false;
  }
}
