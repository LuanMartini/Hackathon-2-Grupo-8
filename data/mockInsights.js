export const commonProblems = [
  { name: "Falha na emissão de nota", cases: 32, change: "+18%", color: "#0d48ff" },
  { name: "Erro de login", cases: 27, change: "+8%", color: "#14b8a6" },
  { name: "Sistema lento", cases: 21, change: "+12%", color: "#7c3aed" },
  { name: "Integração indisponível", cases: 15, change: "+25%", color: "#f59e0b" },
];

export const weeklyVolume = [
  { day: "Seg", value: 18 }, { day: "Ter", value: 27 }, { day: "Qua", value: 22 },
  { day: "Qui", value: 34 }, { day: "Sex", value: 29 }, { day: "Sáb", value: 12 }, { day: "Dom", value: 9 },
];

export const insights = [
  { title: "Integrações concentram os chamados", text: "Falhas de integração representam 34% dos chamados desta semana.", tone: "blue" },
  { title: "Versão 3.2 pede atenção", text: "Usuários da versão 3.2 apresentam maior incidência observada de erros de emissão.", tone: "amber" },
  { title: "Códigos de erro aceleram o suporte", text: "Problemas de login são resolvidos em média 40% mais rápido quando o código do erro é informado.", tone: "violet" },
  { title: "Relatos já podem chegar completos", text: "73% dos chamados poderiam chegar ao suporte com informações suficientes usando o diagnóstico guiado.", tone: "teal" },
];

export const versionSegments = [
  { label: "3.2", value: 42 }, { label: "3.1", value: 31 }, { label: "3.0", value: 18 }, { label: "Outras", value: 9 },
];

export const profileProblems = [
  { profile: "Administradores", primary: "Integração", primaryValue: 42, secondary: "Permissão", secondaryValue: 31 },
  { profile: "Operadores", primary: "Dados inválidos", primaryValue: 38, secondary: "Integração", secondaryValue: 27 },
  { profile: "Gestores", primary: "Desempenho", primaryValue: 35, secondary: "Acesso", secondaryValue: 24 },
];
