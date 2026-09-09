// FUTURO: substituir estas funções por uma chamada à API de LLM.
// A assinatura foi mantida isolada para que a interface não dependa da implementação.

export function generatePossibleCauses(result) {
  return result.causes.map(([name, probability]) => ({ name, probability }));
}

export function generateAIAnalysis({ description, information, probableProblem, category }) {
  const evidence = information.slice(-3).join(" ");
  const focus = {
    Integração: "verificar o status da integração, as credenciais e a última comunicação com o serviço externo",
    "Serviço externo": "consultar o status do provedor e a fila de processamento antes de repetir o envio",
    Permissão: "revisar o perfil de acesso e comparar as permissões com um usuário que consegue concluir a tarefa",
    "Dados inválidos": "validar os campos obrigatórios e a configuração fiscal usada na tentativa",
    Acesso: "orientar a redefinição de senha e verificar tentativas recentes de autenticação",
    Autenticação: "consultar a saúde do serviço de autenticação e os registros da sessão do usuário",
    Conexão: "testar a rede, o proxy e o acesso a partir de outro dispositivo",
    Rede: "comparar a conexão com outro dispositivo ou rede e revisar VPN e proxy",
    Capacidade: "verificar consumo de recursos, filas e picos de requisições no horário informado",
    Desempenho: "comparar o tempo de resposta por funcionalidade e revisar os registros recentes",
    "Indisponibilidade parcial": "verificar a saúde da funcionalidade afetada e suas dependências",
    Indisponibilidade: "consultar a saúde dos serviços envolvidos e incidentes em andamento",
    "Dados duplicados": "comparar os identificadores do cadastro e confirmar qual registro deve permanecer ativo",
    Processamento: "consultar a fila e os registros da rotina para identificar em qual etapa a operação parou",
    Configuração: "revisar as regras, filtros e parâmetros aplicados ao contexto informado",
    Navegador: "verificar bloqueios de pop-up, extensões e permissões de download no navegador",
    Entrega: "consultar a fila de notificações e o status de entrega no canal informado",
    Funcionalidade: "reproduzir a ação afetada e comparar o comportamento com outro contexto equivalente",
  }[category] || "validar os registros do sistema e reproduzir o caminho informado";

  return `O padrão das respostas indica ${probableProblem.toLocaleLowerCase("pt-BR")}. O relato original foi “${description}”. ${evidence} Para a primeira análise, recomenda-se ${focus}. Esta é uma interpretação demonstrativa baseada em regras do MVP.`;
}

export function generateRecommendedActions(category) {
  const actions = {
    Integração: ["Consultar a última comunicação com o provedor", "Validar credenciais e endpoint configurado", "Reprocessar a emissão após confirmar a disponibilidade"],
    "Serviço externo": ["Consultar o status do provedor", "Verificar a fila de documentos", "Repetir o envio após normalização"],
    Permissão: ["Comparar o perfil com um usuário funcional", "Revisar permissões da rotina", "Atualizar o acesso e testar novamente"],
    "Dados inválidos": ["Validar campos obrigatórios", "Revisar a configuração fiscal", "Repetir com um documento conhecido"],
    Acesso: ["Orientar redefinição de senha", "Verificar bloqueio por tentativas", "Confirmar o identificador do usuário"],
    Autenticação: ["Verificar o serviço de autenticação", "Encerrar sessões antigas", "Repetir o login em janela privada"],
    Conexão: ["Testar outra rede", "Revisar proxy ou VPN", "Comparar o acesso em outro dispositivo"],
    Rede: ["Medir a conexão local", "Desabilitar VPN para teste controlado", "Comparar com outro dispositivo"],
    Capacidade: ["Verificar filas e consumo de recursos", "Comparar com o horário do incidente", "Avaliar limite temporário de carga"],
    Desempenho: ["Medir a funcionalidade afetada", "Verificar volume de dados", "Consultar registros do mesmo horário"],
    "Dados duplicados": ["Pesquisar o identificador informado", "Confirmar o cadastro que deve permanecer", "Orientar a correção sem criar outro registro"],
    Processamento: ["Consultar a fila da rotina", "Verificar registros da tentativa", "Reprocessar somente após identificar a etapa pendente"],
    Configuração: ["Revisar regras e parâmetros ativos", "Comparar com uma configuração funcional", "Testar a alteração em um contexto controlado"],
    Navegador: ["Permitir pop-ups e downloads para o sistema", "Testar em janela privada", "Verificar extensões que bloqueiam arquivos"],
    Entrega: ["Consultar a fila de notificações", "Validar o destinatário e a preferência do perfil", "Reenviar após confirmar o evento"],
    Funcionalidade: ["Reproduzir a ação afetada", "Comparar com outro usuário ou contexto", "Consultar os registros da funcionalidade"],
  };
  return actions[category] || ["Reproduzir o caminho informado", "Consultar registros do horário", "Atualizar o chamado com a evidência encontrada"];
}
