// Catálogo local e demonstrativo: em produção, regras e orientações devem ser revisadas pelo suporte.
const solutionCatalog = [
  {
    id: "report-filters",
    title: "Conferir filtros e período do relatório",
    category: "relatorios",
    treeIds: ["reports"],
    resultIds: ["report_filter"],
    whenToUse: "Quando o relatório estiver vazio, incompleto ou diferente do esperado.",
    steps: ["Confira o período selecionado.", "Revise empresa, filial, usuário e demais filtros.", "Teste um período conhecido com registros."],
    estimatedImpact: "Alta chance de esclarecer relatórios vazios.",
    requiresSupport: false,
    safetyNote: "Esta conferência não altera dados nem configurações.",
    priority: 1,
  },
  {
    id: "report-data-check",
    title: "Comparar um registro conhecido",
    category: "relatorios",
    treeIds: ["reports"],
    resultIds: ["report_data"],
    whenToUse: "Quando os valores do relatório parecem incorretos.",
    steps: ["Escolha um registro que você conhece.", "Compare período, status e valor com o relatório.", "Anote o valor esperado e o exibido, se houver diferença."],
    estimatedImpact: "Ajuda a explicar divergências para o suporte.",
    requiresSupport: false,
    safetyNote: "Não edite ou exclua registros durante a conferência.",
    priority: 1,
  },
  {
    id: "report-reduce-period",
    title: "Gerar o relatório com um período menor",
    category: "relatorios",
    treeIds: ["reports", "performance"],
    resultIds: ["report_processing", "performance_slow"],
    whenToUse: "Quando o relatório demora muito, trava ou não termina de carregar.",
    steps: ["Reduza o período consultado.", "Aplique os filtros antes de gerar.", "Compare o resultado com outro relatório menor."],
    estimatedImpact: "Pode reduzir o tempo de processamento.",
    requiresSupport: false,
    safetyNote: "A tentativa não modifica os dados do relatório.",
    priority: 1,
  },
  {
    id: "report-export-format",
    title: "Tentar outro formato de exportação",
    category: "exportacao-download",
    treeIds: ["reports"],
    resultIds: ["report_export"],
    whenToUse: "Quando a exportação de um relatório não funciona.",
    steps: ["Atualize a página.", "Tente exportar em PDF ou CSV.", "Anote o formato que apresentou falha."],
    estimatedImpact: "Resolve falhas ligadas a um formato específico.",
    requiresSupport: false,
    safetyNote: "Não compartilhe arquivos com dados sensíveis fora dos canais autorizados.",
    priority: 1,
  },
  {
    id: "report-download-browser",
    title: "Verificar o bloqueio de download no navegador",
    category: "exportacao-download",
    treeIds: ["reports", "connection"],
    resultIds: ["report_download", "connection_download"],
    whenToUse: "Quando o download não começa ou o arquivo não aparece.",
    steps: ["Confira se o navegador bloqueou o download ou um pop-up.", "Veja a pasta de downloads.", "Tente novamente em uma janela anônima ou outro navegador."],
    estimatedImpact: "Ajuda a identificar bloqueios locais do navegador.",
    requiresSupport: false,
    safetyNote: "Baixe arquivos apenas de fontes conhecidas do sistema.",
    priority: 1,
  },
  {
    id: "invoice-check-data",
    title: "Conferir os dados obrigatórios da nota",
    category: "nota-fiscal",
    treeIds: ["invoice"],
    resultIds: ["invoice_validation", "invoice_not_created"],
    whenToUse: "Quando a nota não é criada ou o sistema indica campos inválidos.",
    steps: ["Revise os campos obrigatórios destacados.", "Confira dados do cliente e do produto.", "Tente emitir novamente sem duplicar a operação."],
    estimatedImpact: "Resolve pendências simples de preenchimento.",
    requiresSupport: false,
    safetyNote: "Antes de repetir a emissão, confirme se a nota ainda não foi criada.",
    priority: 1,
  },
  {
    id: "invoice-integration-check",
    title: "Registrar os detalhes da falha de integração",
    category: "integracao",
    treeIds: ["invoice", "integration"],
    resultIds: ["invoice_integration", "integration_failure"],
    whenToUse: "Quando houver erro de integração ao emitir uma nota.",
    steps: ["Anote a mensagem ou código exibido.", "Confira se o problema continua após alguns minutos.", "Abra um chamado com o horário e os dados não sensíveis da tentativa."],
    estimatedImpact: "Entrega ao suporte as informações necessárias para investigar.",
    requiresSupport: false,
    safetyNote: "Não altere certificados, credenciais ou integrações por conta própria.",
    priority: 1,
  },
  {
    id: "login-reset-password",
    title: "Redefinir a senha pelo fluxo oficial",
    category: "login-senha",
    treeIds: ["login"],
    resultIds: ["login_password", "login_blocked"],
    whenToUse: "Quando a senha não é aceita ou a conta parece bloqueada.",
    steps: ["Confira o usuário informado.", "Use a opção oficial de redefinição de senha.", "Entre novamente após concluir a redefinição."],
    estimatedImpact: "Pode recuperar o acesso sem intervenção manual.",
    requiresSupport: false,
    safetyNote: "Nunca compartilhe sua senha ou código de verificação.",
    priority: 1,
  },
  {
    id: "login-private-window",
    title: "Testar o acesso em janela anônima",
    category: "login-senha",
    treeIds: ["login"],
    resultIds: ["login_session"],
    whenToUse: "Quando o acesso falha somente em um navegador ou sessão.",
    steps: ["Abra uma janela anônima.", "Acesse a página oficial do sistema.", "Tente entrar com suas próprias credenciais."],
    estimatedImpact: "Ajuda a separar problemas de sessão e navegador.",
    requiresSupport: false,
    safetyNote: "Feche a janela anônima ao terminar em computadores compartilhados.",
    priority: 2,
  },
  {
    id: "registration-check-fields",
    title: "Revisar os campos do cadastro",
    category: "cadastro",
    treeIds: ["registration"],
    resultIds: ["registration_validation", "registration_save"],
    whenToUse: "Quando um cadastro não salva ou indica campo obrigatório.",
    steps: ["Confira os campos com aviso.", "Revise formato de e-mail, documento e datas.", "Tente salvar novamente."],
    estimatedImpact: "Resolve falhas comuns de validação.",
    requiresSupport: false,
    safetyNote: "Não apague informações existentes sem confirmar a necessidade.",
    priority: 1,
  },
  {
    id: "notification-check-inbox",
    title: "Conferir o recebimento da notificação",
    category: "notificacoes",
    treeIds: ["notifications"],
    resultIds: ["notification_not_received", "notification_delay"],
    whenToUse: "Quando um e-mail, aviso ou confirmação não chega.",
    steps: ["Confira caixa de spam e lixeira.", "Verifique se o e-mail cadastrado está correto.", "Aguarde alguns minutos e tente a ação novamente, se seguro."],
    estimatedImpact: "Resolve casos de bloqueio ou atraso no recebimento.",
    requiresSupport: false,
    safetyNote: "Não informe códigos de confirmação a outras pessoas.",
    priority: 1,
  },
  {
    id: "performance-reduce-scope",
    title: "Reduzir a quantidade de dados consultada",
    category: "lentidao",
    treeIds: ["performance"],
    resultIds: ["performance_slow", "performance_all_users"],
    whenToUse: "Quando o sistema está lento ou travando.",
    steps: ["Reduza o período ou aplique filtros.", "Feche abas que não estiver usando.", "Teste uma ação menor para comparar."],
    estimatedImpact: "Pode melhorar a resposta em consultas grandes.",
    requiresSupport: false,
    safetyNote: "Não atualize a página durante uma operação que esteja salvando dados.",
    priority: 1,
  },
  {
    id: "permission-record-context",
    title: "Confirmar o acesso esperado antes de pedir suporte",
    category: "permissoes",
    treeIds: ["permissions"],
    resultIds: ["permission_denied", "permission_role"],
    whenToUse: "Quando uma área ou ação não está disponível para o seu perfil.",
    steps: ["Confira se está no perfil ou conta correta.", "Anote a área e a ação que você precisava realizar.", "Abra um chamado informando o acesso esperado."],
    estimatedImpact: "Ajuda o suporte a avaliar o acesso sem mudanças indevidas.",
    requiresSupport: false,
    safetyNote: "Não tente alterar permissões, perfis ou contas por conta própria.",
    priority: 1,
  },
  {
    id: "integration-retry-safely",
    title: "Confirmar se a integração voltou a responder",
    category: "integracao",
    treeIds: ["integration"],
    resultIds: ["integration_failure", "integration_timeout"],
    whenToUse: "Quando uma integração falha ou demora a responder.",
    steps: ["Aguarde alguns minutos.", "Tente novamente apenas uma vez, se a ação não gerar duplicidade.", "Registre a mensagem e o horário da tentativa."],
    estimatedImpact: "Identifica falhas temporárias sem alterar integrações.",
    requiresSupport: false,
    safetyNote: "Não altere chaves, tokens ou configurações de integração.",
    priority: 1,
  },
  {
    id: "connection-check-browser",
    title: "Testar a conexão em outro navegador",
    category: "conexao",
    treeIds: ["connection"],
    resultIds: ["connection_failure", "connection_download"],
    whenToUse: "Quando uma tela não carrega, cai ou falha ao baixar algo.",
    steps: ["Verifique se outros sites carregam normalmente.", "Atualize a página.", "Teste em outro navegador ou rede confiável."],
    estimatedImpact: "Ajuda a identificar falhas locais de conexão.",
    requiresSupport: false,
    safetyNote: "Evite redes públicas ao acessar dados do sistema.",
    priority: 1,
  },
  {
    id: "general-record-details",
    title: "Registrar os detalhes para o suporte",
    category: "geral",
    treeIds: ["general"],
    resultIds: [],
    whenToUse: "Quando ainda não há uma tentativa segura e específica.",
    steps: ["Anote o que você tentou fazer.", "Registre a mensagem exibida e o horário.", "Abra um chamado com essas informações."],
    estimatedImpact: "Acelera a investigação sem arriscar alterações.",
    requiresSupport: false,
    safetyNote: "Não compartilhe senhas, códigos ou dados sensíveis no chamado.",
    priority: 3,
  },
];

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const priorityScore = { 1: 30, 2: 20, 3: 10 };

/**
 * Escolhe somente orientações locais, reversíveis e seguras para o resultado atual.
 * Esta recomendação é demonstrativa e não substitui a avaliação do suporte humano.
 */
export function getRecommendedSolutions(diagnosisResult = {}, attemptedSolutions = []) {
  const treeId = diagnosisResult.treeId;
  const resultId = diagnosisResult.id;
  const category = normalize(diagnosisResult.category);
  const context = normalize([
    diagnosisResult.title,
    diagnosisResult.summary,
    ...(diagnosisResult.path || []).flatMap((item) => [item.question, item.answer]),
  ].filter(Boolean).join(" "));

  const triedIds = new Set(attemptedSolutions
    .filter((attempt) => ["nao-resolveu", "nao-consegui"].includes(attempt.outcome))
    .map((attempt) => attempt.solutionId));

  const ranked = solutionCatalog
    .filter((solution) => !solution.requiresSupport)
    .filter((solution) => !triedIds.has(solution.id))
    .map((solution) => {
      let score = priorityScore[solution.priority] || 0;
      if (solution.treeIds.includes(treeId)) score += 60;
      if (solution.resultIds.includes(resultId)) score += 70;
      if (category && normalize(solution.category) === category) score += 25;

      const terms = normalize(`${solution.title} ${solution.whenToUse}`).split(/\s+/).filter((term) => term.length > 4);
      score += Math.min(terms.filter((term) => context.includes(term)).length * 3, 15);
      return { ...solution, score };
    })
    .filter((solution) => solution.score >= 50)
    .sort((first, second) => second.score - first.score || first.priority - second.priority)
    .slice(0, 3);

  const safeFallback = solutionCatalog.find((solution) => solution.id === "general-record-details" && !triedIds.has(solution.id));
  const selected = ranked.length ? ranked : (safeFallback ? [safeFallback] : []);
  return selected.map((solution, index) => ({ ...solution, recommended: index === 0 }));
}

function needsHumanSupport(result = {}) {
  const category = normalize(result.category);
  const resultId = normalize(result.id);
  return result.treeId === "integration"
    || ["permissao", "indisponibilidade", "servico externo"].includes(category)
    || /(integration|permission|outage|external|duplicate)/.test(resultId);
}

function getHumanExplanation(result = {}) {
  const category = normalize(result.category);
  if (result.treeId === "reports" && /filter|data/.test(result.id || "")) return "Pelo que você nos contou, o relatório pode estar sendo afetado pelos filtros, período ou dados disponíveis.";
  if (result.treeId === "reports" && /download|export/.test(result.id || "")) return "Pelo que você nos contou, o relatório foi gerado, mas o arquivo pode estar sendo bloqueado ou exportado em um formato com falha.";
  if (result.treeId === "reports" && /processing/.test(result.id || "")) return "Pelo que você nos contou, a geração do relatório pode estar demorando por causa do volume ou do processamento.";
  if (result.treeId === "login") return "Pelo que você nos contou, o acesso pode estar sendo afetado pelas credenciais, pela sessão ou por um bloqueio de segurança.";
  if (result.treeId === "invoice" && /integration/.test(result.id || "")) return "A emissão depende de um serviço externo. Para manter seus dados seguros, este caso deve ser analisado pelo suporte.";
  if (result.treeId === "notifications") return "Pelo que você nos contou, a notificação pode estar atrasada ou ter sido direcionada para outra caixa de entrada.";
  if (result.treeId === "registration") return "Pelo que você nos contou, algum campo ou regra do cadastro pode precisar de conferência.";
  if (category === "permissao") return "Esse acesso depende do seu perfil. O suporte precisa avaliar a solicitação sem alterar permissões de forma indevida.";
  return "Com base nas respostas, selecionamos uma verificação segura e adequada para você tentar agora.";
}

/**
 * Avaliação local demonstrativa. Em produção, a decisão e o encaminhamento devem
 * ser confirmados por regras validadas no servidor e pela equipe de suporte.
 */
export function evaluateCaseAndRecommendSolution(diagnosisResult = {}, attemptedSolutions = [], context = {}) {
  const requiresSupport = needsHumanSupport(diagnosisResult);
  const solutions = requiresSupport ? [] : getRecommendedSolutions(diagnosisResult, attemptedSolutions);
  const remaining = solutions.length > 0;
  const tried = attemptedSolutions.map((attempt) => ({ ...attempt }));
  const hasUnresolvedAttempt = tried.some((attempt) => attempt.outcome === "nao-resolveu");

  return {
    probableProblem: diagnosisResult.title || "Problema precisa de avaliação",
    confidence: diagnosisResult.confidence || 0,
    explanation: getHumanExplanation(diagnosisResult),
    recommendedSolution: solutions[0] || null,
    alternatives: solutions.slice(1),
    solutions,
    requiresSupport: requiresSupport || !remaining,
    supportReason: requiresSupport
      ? "Este caso pode envolver integração, indisponibilidade, permissão ou risco de duplicidade. O suporte deve avaliar com segurança."
      : hasUnresolvedAttempt && !remaining
        ? "As tentativas locais seguras já foram registradas. Agora o suporte pode investigar com esse contexto."
        : "Se precisar abrir chamado, suas respostas e tentativas serão incluídas automaticamente.",
    contextForTicket: {
      description: diagnosisResult.description || "",
      result: diagnosisResult.title || "",
      answers: diagnosisResult.path || [],
      attempts: tried,
      hasEvidence: Boolean(context.evidence),
      browser: context.browser || "Navegador coletado ao criar o chamado",
      device: context.device || "Dispositivo coletado ao criar o chamado",
    },
  };
}

export { solutionCatalog };
