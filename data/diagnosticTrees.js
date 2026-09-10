const yesNoUnknown = (yes, no, unknown = no) => [
  { id: "yes", label: "Sim", ...yes },
  { id: "no", label: "Não", ...no },
  { id: "unknown", label: "Não sei", ...unknown },
];

export const diagnosticTrees = {
  invoice: {
    id: "invoice",
    name: "Emissão de nota fiscal",
    keywords: ["nota", "nf", "fiscal", "emitir", "emissão"],
    maxQuestions: 6,
    startNode: "invoice_created",
    problems: ["integration", "configuration", "external_service", "permission", "outage", "invalid_data"],
    nodes: {
      invoice_created: {
        id: "invoice_created",
        question: "A nota chegou a ser criada?",
        possibleProblems: ["integration", "configuration", "external_service", "permission", "outage", "invalid_data"],
        answers: yesNoUnknown(
          { next: "invoice_sent", keep: ["integration", "external_service", "outage"], info: "A nota foi criada, mas o processo não foi concluído." },
          { next: "invoice_error", keep: ["configuration", "permission", "invalid_data", "integration"], info: "A nota não chegou a ser criada." },
          { next: "invoice_error", keep: ["integration", "configuration", "external_service", "invalid_data"], info: "O usuário não conseguiu confirmar se a nota foi criada." },
        ),
      },
      invoice_sent: {
        id: "invoice_sent",
        question: "A nota foi enviada ao serviço de emissão?",
        possibleProblems: ["integration", "external_service", "outage"],
        answers: yesNoUnknown(
          { next: "invoice_status", keep: ["external_service", "outage"], info: "A nota foi enviada ao serviço de emissão." },
          { next: "invoice_connection", keep: ["integration"], info: "O envio ao serviço de emissão não foi concluído." },
          { next: "invoice_connection", keep: ["integration", "external_service"], info: "Não foi possível confirmar o envio externo." },
        ),
      },
      invoice_error: {
        id: "invoice_error",
        question: "Aparece alguma mensagem de erro?",
        possibleProblems: ["configuration", "permission", "invalid_data", "integration"],
        answers: yesNoUnknown(
          { next: "invoice_error_type", keep: ["integration", "permission", "invalid_data", "configuration"], info: "Uma mensagem de erro é exibida." },
          { next: "invoice_scope", keep: ["permission", "configuration", "outage"], info: "Nenhuma mensagem de erro é exibida." },
          { next: "invoice_scope", keep: ["integration", "configuration", "outage"], info: "O usuário não identificou uma mensagem de erro." },
        ),
      },
      invoice_error_type: {
        id: "invoice_error_type",
        question: "Qual destas opções mais se parece com o erro?",
        possibleProblems: ["integration", "permission", "invalid_data", "configuration"],
        answers: [
          { id: "communication", label: "Falha de comunicação ou conexão", next: "invoice_frequency", keep: ["integration", "external_service"], info: "O erro indica falha de comunicação com um serviço." },
          { id: "data", label: "Dados inválidos ou campo obrigatório", next: "invoice_frequency", keep: ["invalid_data", "configuration"], info: "O erro menciona dados inválidos ou obrigatórios." },
          { id: "access", label: "Sem permissão ou acesso negado", next: "invoice_scope", keep: ["permission"], info: "O erro indica falta de permissão." },
          { id: "other", label: "Outro erro / não sei dizer", next: "invoice_scope", keep: ["integration", "configuration", "invalid_data"], info: "O texto do erro não foi identificado." },
        ],
      },
      invoice_connection: {
        id: "invoice_connection",
        question: "Outras funções que usam internet estão funcionando?",
        possibleProblems: ["integration", "external_service"],
        answers: yesNoUnknown(
          { next: "invoice_frequency", keep: ["integration", "external_service"], info: "A conexão geral funciona normalmente." },
          { result: "invoice_outage", keep: ["outage"], info: "Outras funções online também apresentam falha." },
          { next: "invoice_frequency", keep: ["integration", "external_service"], info: "A conexão geral não foi confirmada." },
        ),
      },
      invoice_scope: {
        id: "invoice_scope",
        question: "Isso acontece também com outros usuários?",
        possibleProblems: ["permission", "configuration", "outage", "integration", "invalid_data"],
        answers: yesNoUnknown(
          { next: "invoice_frequency", keep: ["integration", "configuration", "outage"], info: "Outros usuários também são afetados." },
          { result: "invoice_permission", keep: ["permission", "invalid_data"], info: "O problema parece restrito a este usuário." },
          { next: "invoice_frequency", keep: ["integration", "configuration", "invalid_data"], info: "O alcance entre usuários não foi confirmado." },
        ),
      },
      invoice_frequency: {
        id: "invoice_frequency",
        question: "O problema acontece em todas as tentativas?",
        possibleProblems: ["integration", "external_service", "configuration", "outage", "invalid_data"],
        answers: [
          { id: "always", label: "Sim, em todas", result: "invoice_integration", keep: ["integration", "external_service"], info: "A falha ocorre em todas as tentativas." },
          { id: "sometimes", label: "Acontece às vezes", result: "invoice_external", keep: ["external_service", "integration"], info: "A falha é intermitente." },
          { id: "first", label: "Foi a primeira vez", result: "invoice_invalid", keep: ["invalid_data", "configuration"], info: "A falha foi observada pela primeira vez." },
        ],
      },
      invoice_status: {
        id: "invoice_status",
        question: "O status ficou parado em “processando”?",
        possibleProblems: ["external_service", "outage"],
        answers: yesNoUnknown(
          { result: "invoice_external", keep: ["external_service"], info: "A nota permanece em processamento." },
          { result: "invoice_outage", keep: ["outage"], info: "O processo encerrou sem conclusão." },
          { result: "invoice_external", keep: ["external_service"], info: "O status final não foi identificado." },
        ),
      },
    },
    results: {
      invoice_integration: { title: "Falha na integração com o serviço de emissão", category: "Integração", priority: "Alta", confidence: 87, causes: [["Comunicação com o serviço externo", 87], ["Configuração da integração", 9], ["Dados inválidos", 4]] },
      invoice_external: { title: "Instabilidade no serviço externo de emissão", category: "Serviço externo", priority: "Alta", confidence: 82, causes: [["Instabilidade do provedor", 82], ["Fila de processamento", 12], ["Configuração da integração", 6]] },
      invoice_permission: { title: "Permissão insuficiente para emitir nota", category: "Permissão", priority: "Média", confidence: 79, causes: [["Perfil sem permissão", 79], ["Regra de acesso desatualizada", 14], ["Dados do usuário", 7]] },
      invoice_invalid: { title: "Dados da nota precisam de validação", category: "Dados inválidos", priority: "Média", confidence: 74, causes: [["Campo obrigatório ou inválido", 74], ["Configuração fiscal", 18], ["Regra de integração", 8]] },
      invoice_outage: { title: "Indisponibilidade no processo de emissão", category: "Indisponibilidade", priority: "Alta", confidence: 76, causes: [["Serviço temporariamente indisponível", 76], ["Conexão local", 16], ["Sobrecarga", 8]] },
    },
  },
  login: {
    id: "login", name: "Acesso à conta", keywords: ["login", "acessar", "acesso", "conta", "senha", "entrar"], maxQuestions: 6,
    startNode: "login_error", problems: ["wrong_password", "blocked_account", "authentication", "connection", "outage"],
    nodes: {
      login_error: { id: "login_error", question: "Aparece alguma mensagem ao tentar entrar?", possibleProblems: ["wrong_password", "blocked_account", "authentication", "connection", "outage"], answers: yesNoUnknown(
        { next: "login_message", keep: ["wrong_password", "blocked_account", "authentication", "connection"], info: "Uma mensagem aparece ao tentar entrar." },
        { next: "login_scope", keep: ["connection", "outage", "authentication"], info: "A tela não exibe mensagem de erro." },
        { next: "login_scope", keep: ["connection", "outage", "authentication"], info: "A mensagem de erro não foi identificada." }) },
      login_message: { id: "login_message", question: "O que a mensagem informa?", possibleProblems: ["wrong_password", "blocked_account", "authentication", "connection"], answers: [
        { id: "password", label: "Usuário ou senha incorretos", next: "login_reset", keep: ["wrong_password", "blocked_account"], info: "A mensagem indica credenciais incorretas." },
        { id: "blocked", label: "Conta bloqueada", result: "login_blocked", keep: ["blocked_account"], info: "A conta aparece como bloqueada." },
        { id: "connect", label: "Falha de conexão", next: "login_scope", keep: ["connection", "outage"], info: "A mensagem indica falha de conexão." },
        { id: "other", label: "Outro erro / não sei", next: "login_scope", keep: ["authentication", "connection", "outage"], info: "O texto da mensagem não foi reconhecido." }] },
      login_reset: { id: "login_reset", question: "Você já tentou redefinir a senha?", hint: "Isso ajuda a separar uma credencial incorreta de uma falha no processo de acesso.", possibleProblems: ["wrong_password", "blocked_account"], answers: yesNoUnknown(
        { next: "login_reset_outcome", keep: ["wrong_password", "authentication", "blocked_account"], info: "A pessoa já iniciou uma redefinição de senha." },
        { result: "login_password", keep: ["wrong_password"], info: "A senha ainda não foi redefinida." },
        { result: "login_password", keep: ["wrong_password"], info: "Não foi possível confirmar uma redefinição de senha." }) },
      login_reset_outcome: { id: "login_reset_outcome", question: "Depois de redefinir, a nova senha foi aceita?", possibleProblems: ["wrong_password", "blocked_account", "authentication"], answers: yesNoUnknown(
        { result: "login_auth", keep: ["authentication", "blocked_account"], info: "Mesmo com a nova senha, o acesso não foi concluído." },
        { result: "login_password", keep: ["wrong_password"], info: "A nova senha não foi aceita." },
        { result: "login_auth", keep: ["authentication", "blocked_account"], info: "Não foi possível confirmar o resultado da redefinição." }) },
      login_scope: { id: "login_scope", question: "Outros usuários também não conseguem entrar?", possibleProblems: ["connection", "outage", "authentication"], answers: yesNoUnknown(
        { next: "login_site", keep: ["outage", "authentication"], info: "O acesso falha para outros usuários." },
        { next: "login_network", keep: ["connection", "authentication"], info: "O problema parece individual." },
        { next: "login_site", keep: ["outage", "connection", "authentication"], info: "O alcance do problema não foi confirmado." }) },
      login_network: { id: "login_network", question: "Você consegue abrir outros sites normalmente?", possibleProblems: ["connection", "authentication"], answers: yesNoUnknown(
        { result: "login_auth", keep: ["authentication"], info: "Outros sites abrem normalmente." },
        { result: "login_connection", keep: ["connection"], info: "Outros sites também apresentam dificuldade." },
        { result: "login_connection", keep: ["connection", "authentication"], info: "A conexão geral não foi confirmada." }) },
      login_site: { id: "login_site", question: "A tela chega a carregar antes da falha?", possibleProblems: ["outage", "authentication", "connection"], answers: yesNoUnknown(
        { result: "login_auth", keep: ["authentication"], info: "A tela carrega antes da falha de autenticação." },
        { result: "login_outage", keep: ["outage", "connection"], info: "A tela de acesso não carrega." },
        { result: "login_outage", keep: ["outage", "authentication"], info: "O carregamento da tela não foi confirmado." }) },
    },
    results: {
      login_password: { title: "Credenciais de acesso precisam ser atualizadas", category: "Acesso", priority: "Média", confidence: 84, causes: [["Senha incorreta", 84], ["Conta bloqueada", 10], ["Falha de autenticação", 6]] },
      login_blocked: { title: "Conta bloqueada", category: "Acesso", priority: "Alta", confidence: 92, causes: [["Bloqueio por tentativas", 92], ["Política de segurança", 6], ["Cadastro do usuário", 2]] },
      login_auth: { title: "Falha no serviço de autenticação", category: "Autenticação", priority: "Alta", confidence: 81, causes: [["Serviço de autenticação", 81], ["Sessão expirada", 12], ["Perfil do usuário", 7]] },
      login_connection: { title: "Problema de conexão no dispositivo", category: "Conexão", priority: "Média", confidence: 77, causes: [["Rede local", 77], ["DNS ou proxy", 15], ["Serviço indisponível", 8]] },
      login_outage: { title: "Indisponibilidade do serviço de acesso", category: "Indisponibilidade", priority: "Alta", confidence: 79, causes: [["Serviço indisponível", 79], ["Falha de rede ampla", 14], ["Manutenção", 7]] },
    },
  },
  performance: {
    id: "performance", name: "Sistema lento", keywords: ["lento", "lentidão", "devagar", "travando", "demora"], maxQuestions: 6,
    startNode: "slow_scope", problems: ["general", "network", "single_user", "feature", "partial_outage", "overload"],
    nodes: {
      slow_scope: { id: "slow_scope", question: "A lentidão acontece com outros usuários?", possibleProblems: ["general", "network", "single_user", "feature", "partial_outage", "overload"], answers: yesNoUnknown(
        { next: "slow_area", keep: ["general", "feature", "partial_outage", "overload"], info: "Outros usuários também percebem lentidão." },
        { next: "slow_connection", keep: ["network", "single_user"], info: "A lentidão parece restrita a este usuário." },
        { next: "slow_area", keep: ["general", "network", "feature", "overload"], info: "O alcance da lentidão não foi confirmado." }) },
      slow_area: { id: "slow_area", question: "O sistema inteiro está lento?", possibleProblems: ["general", "feature", "partial_outage", "overload"], answers: yesNoUnknown(
        { next: "slow_period", keep: ["general", "overload"], info: "A lentidão afeta o sistema inteiro." },
        { next: "slow_feature", keep: ["feature", "partial_outage"], info: "A lentidão ocorre em uma parte específica." },
        { next: "slow_period", keep: ["general", "feature", "overload"], info: "A área afetada não foi identificada." }) },
      slow_connection: { id: "slow_connection", question: "Outros sites também estão lentos neste dispositivo?", possibleProblems: ["network", "single_user"], answers: yesNoUnknown(
        { result: "slow_network", keep: ["network"], info: "Outros sites também estão lentos." },
        { next: "slow_browser", keep: ["single_user"], info: "A lentidão ocorre somente neste sistema." },
        { next: "slow_browser", keep: ["single_user", "network"], info: "A velocidade de outros sites não foi confirmada." }) },
      slow_browser: { id: "slow_browser", question: "Ao abrir em janela anônima ou outro navegador, a lentidão continua?", hint: "Essa comparação indica se o problema está no ambiente local ou na sessão do usuário.", possibleProblems: ["single_user", "network"], answers: yesNoUnknown(
        { result: "slow_user", keep: ["single_user"], info: "A lentidão continua fora da sessão atual." },
        { result: "slow_cache", keep: ["single_user"], info: "A lentidão não ocorre em outro navegador ou janela privada." },
        { result: "slow_user", keep: ["single_user", "network"], info: "A comparação com outro navegador não foi realizada." }) },
      slow_feature: { id: "slow_feature", question: "A área afetada chega a parar de responder?", possibleProblems: ["feature", "partial_outage"], answers: yesNoUnknown(
        { result: "slow_partial", keep: ["partial_outage"], info: "A funcionalidade para de responder." },
        { result: "slow_feature_result", keep: ["feature"], info: "A funcionalidade responde, mas com atraso." },
        { result: "slow_feature_result", keep: ["feature", "partial_outage"], info: "Não foi possível confirmar interrupção total." }) },
      slow_period: { id: "slow_period", question: "A lentidão piora nos horários de maior uso?", possibleProblems: ["general", "overload"], answers: yesNoUnknown(
        { result: "slow_overload", keep: ["overload"], info: "A lentidão piora em horários de pico." },
        { result: "slow_general", keep: ["general"], info: "A lentidão não varia com o horário." },
        { result: "slow_general", keep: ["general", "overload"], info: "A relação com horários de pico não foi confirmada." }) },
    },
    results: {
      slow_network: { title: "Lentidão relacionada à rede local", category: "Rede", priority: "Média", confidence: 83, causes: [["Conexão local", 83], ["Proxy ou VPN", 11], ["Carga do sistema", 6]] },
      slow_user: { title: "Lentidão restrita ao ambiente do usuário", category: "Desempenho", priority: "Média", confidence: 76, causes: [["Cache ou navegador", 76], ["Sessão do usuário", 16], ["Rede local", 8]] },
      slow_cache: { title: "Sessão ou cache do navegador precisa ser renovado", category: "Desempenho", priority: "Baixa", confidence: 84, causes: [["Cache ou dados locais", 84], ["Extensão do navegador", 10], ["Sessão expirada", 6]] },
      slow_partial: { title: "Indisponibilidade parcial de uma funcionalidade", category: "Indisponibilidade parcial", priority: "Alta", confidence: 85, causes: [["Serviço parcial indisponível", 85], ["Fila de processamento", 10], ["Dependência externa", 5]] },
      slow_feature_result: { title: "Lentidão em uma funcionalidade específica", category: "Desempenho", priority: "Média", confidence: 78, causes: [["Processamento da funcionalidade", 78], ["Volume de dados", 14], ["Dependência externa", 8]] },
      slow_overload: { title: "Sobrecarga em horários de maior uso", category: "Capacidade", priority: "Alta", confidence: 88, causes: [["Sobrecarga de processamento", 88], ["Fila de requisições", 8], ["Banco de dados", 4]] },
      slow_general: { title: "Degradação geral de desempenho", category: "Desempenho", priority: "Alta", confidence: 80, causes: [["Desempenho geral do serviço", 80], ["Banco de dados", 13], ["Rede", 7]] },
    },
  },
  registration: {
    id: "registration",
    name: "Cadastro de clientes ou usuários",
    keywords: ["cadastro", "cadastrar", "registrar", "incluir cliente", "novo cliente", "salvar cliente"],
    maxQuestions: 5,
    startNode: "registration_stage",
    problems: ["invalid_data", "duplicate", "permission", "configuration", "processing"],
    nodes: {
      registration_stage: { id: "registration_stage", question: "Em que momento o cadastro não funciona?", hint: "Escolha o momento mais próximo do que aconteceu.", possibleProblems: ["invalid_data", "duplicate", "permission", "configuration", "processing"], answers: [
        { id: "save", label: "Ao salvar os dados preenchidos", description: "O formulário abre, mas não conclui o salvamento.", next: "registration_field", keep: ["invalid_data", "duplicate", "processing"], info: "A falha ocorre ao salvar o formulário." },
        { id: "open", label: "Antes de abrir o formulário", description: "A tela não abre ou mostra acesso negado.", next: "registration_access", keep: ["permission", "configuration"], info: "A pessoa não chega ao formulário de cadastro." },
        { id: "after", label: "Depois de confirmar o cadastro", description: "A confirmação aparece, mas o registro não fica disponível.", next: "registration_visible", keep: ["processing", "configuration"], info: "O cadastro foi confirmado, mas o resultado não está visível." },
      ] },
      registration_field: { id: "registration_field", question: "O sistema indica algum campo inválido ou obrigatório?", possibleProblems: ["invalid_data", "duplicate", "processing"], answers: yesNoUnknown(
        { result: "registration_invalid", keep: ["invalid_data"], info: "O sistema apontou um campo que precisa de correção." },
        { next: "registration_duplicate", keep: ["duplicate", "processing"], info: "Nenhum campo específico foi destacado." },
        { next: "registration_duplicate", keep: ["invalid_data", "duplicate", "processing"], info: "Não foi possível confirmar a validação dos campos." }) },
      registration_duplicate: { id: "registration_duplicate", question: "A mensagem menciona que o cadastro já existe?", possibleProblems: ["duplicate", "processing"], answers: yesNoUnknown(
        { result: "registration_duplicate_result", keep: ["duplicate"], info: "O sistema identificou um registro duplicado." },
        { result: "registration_processing", keep: ["processing"], info: "Não há indicação de duplicidade." },
        { result: "registration_processing", keep: ["processing", "duplicate"], info: "A mensagem não permitiu confirmar duplicidade." }) },
      registration_access: { id: "registration_access", question: "A tela informa falta de permissão?", possibleProblems: ["permission", "configuration"], answers: yesNoUnknown(
        { result: "registration_permission", keep: ["permission"], info: "A tela bloqueia o acesso por perfil." },
        { result: "registration_configuration", keep: ["configuration"], info: "A tela não abre sem informar falta de permissão." },
        { result: "registration_configuration", keep: ["configuration", "permission"], info: "A causa do bloqueio ao abrir a tela não foi identificada." }) },
      registration_visible: { id: "registration_visible", question: "Após atualizar a lista, o novo cadastro aparece?", possibleProblems: ["processing", "configuration"], answers: yesNoUnknown(
        { result: "registration_sync", keep: ["processing"], info: "O registro existe, mas demorou para aparecer na lista." },
        { result: "registration_processing", keep: ["processing", "configuration"], info: "O registro não aparece mesmo após atualizar a tela." },
        { result: "registration_processing", keep: ["processing", "configuration"], info: "Não foi possível confirmar a presença do registro." }) },
    },
    results: {
      registration_invalid: { title: "Dados do cadastro precisam de correção", category: "Dados inválidos", priority: "Média", confidence: 86, causes: [["Campo obrigatório ou formato inválido", 86], ["Regra de validação", 9], ["Configuração do formulário", 5]] },
      registration_duplicate_result: { title: "Cadastro já existente", category: "Dados duplicados", priority: "Baixa", confidence: 91, causes: [["Registro com identificador já usado", 91], ["Cadastro criado anteriormente", 6], ["Sincronização pendente", 3]] },
      registration_processing: { title: "Falha ao salvar o cadastro", category: "Processamento", priority: "Alta", confidence: 78, causes: [["Processamento do cadastro", 78], ["Regra de negócio", 14], ["Serviço dependente", 8]] },
      registration_permission: { title: "Perfil sem permissão para cadastrar", category: "Permissão", priority: "Média", confidence: 88, causes: [["Permissão ausente no perfil", 88], ["Regra de acesso", 8], ["Sessão desatualizada", 4]] },
      registration_configuration: { title: "Configuração da tela de cadastro precisa ser revisada", category: "Configuração", priority: "Média", confidence: 73, causes: [["Configuração da rotina", 73], ["Regra de acesso", 17], ["Dependência da tela", 10]] },
      registration_sync: { title: "Atualização do cadastro está pendente", category: "Processamento", priority: "Baixa", confidence: 82, causes: [["Atualização da lista", 82], ["Fila de processamento", 12], ["Cache da tela", 6]] },
    },
  },
  reports: {
    id: "reports",
    name: "Relatórios e exportações",
    keywords: ["relatório", "relatorio", "exportar", "exportação", "planilha", "baixar pdf", "download", "gerar relatório"],
    maxQuestions: 6,
    startNode: "report_name",
    problems: ["processing", "download", "invalid_data", "permission", "configuration"],
    nodes: {
      report_name: { id: "report_name", question: "Qual relatório você estava consultando?", hint: "Escolha a opção mais próxima. Isso ajuda o suporte a entender o contexto sem pedir a mesma informação depois.", possibleProblems: ["processing", "download", "invalid_data", "permission", "configuration"], answers: [
        { id: "sales", label: "Vendas", next: "report_stage", keep: ["processing", "download", "invalid_data", "permission", "configuration"], info: "O relatório consultado é de vendas." },
        { id: "financial", label: "Financeiro", next: "report_stage", keep: ["processing", "download", "invalid_data", "permission", "configuration"], info: "O relatório consultado é financeiro." },
        { id: "inventory", label: "Estoque", next: "report_stage", keep: ["processing", "download", "invalid_data", "permission", "configuration"], info: "O relatório consultado é de estoque." },
        { id: "customers", label: "Clientes", next: "report_stage", keep: ["processing", "download", "invalid_data", "permission", "configuration"], info: "O relatório consultado é de clientes." },
        { id: "other", label: "Outro relatório", next: "report_stage", keep: ["processing", "download", "invalid_data", "permission", "configuration"], info: "A pessoa usa outro tipo de relatório." },
      ] },
      report_stage: { id: "report_stage", question: "Qual parte do relatório não funcionou?", hint: "Isso define se o problema está na geração, no conteúdo ou no arquivo baixado.", possibleProblems: ["processing", "download", "invalid_data", "permission", "configuration"], answers: [
        { id: "generate", label: "O relatório não é gerado", description: "A tela fica carregando ou retorna um erro.", next: "report_timing", keep: ["processing", "permission", "configuration"], info: "A geração do relatório não foi concluída." },
        { id: "export", label: "O relatório gera, mas não baixa", description: "O arquivo deveria abrir ou ser salvo, mas isso não acontece.", next: "report_format", keep: ["download", "configuration"], info: "O conteúdo foi gerado, mas o arquivo não foi obtido." },
        { id: "content", label: "O relatório abre com dados errados ou faltando", description: "Inclui relatório vazio, incompleto ou com valores diferentes do esperado.", next: "report_data_state", keep: ["invalid_data", "permission", "configuration"], info: "O relatório foi criado, mas o conteúdo precisa de validação." },
      ] },
      report_timing: { id: "report_timing", question: "Esse problema começou hoje ou já acontecia antes?", possibleProblems: ["processing", "permission", "configuration"], answers: [
        { id: "today", label: "Começou hoje", next: "report_scope", keep: ["processing", "configuration"], info: "A falha na geração começou hoje." },
        { id: "before", label: "Já acontecia antes", next: "report_scope", keep: ["processing", "permission", "configuration"], info: "A falha na geração já ocorria anteriormente." },
        { id: "unknown", label: "Não sei informar", next: "report_scope", keep: ["processing", "permission", "configuration"], info: "Não foi possível confirmar quando a falha começou." },
      ] },
      report_format: { id: "report_format", question: "Qual formato você escolheu para exportar?", possibleProblems: ["download", "configuration"], answers: [
        { id: "pdf", label: "PDF", next: "report_download", keep: ["download", "configuration"], info: "A exportação foi solicitada em PDF." },
        { id: "excel", label: "Excel", next: "report_download", keep: ["download", "configuration"], info: "A exportação foi solicitada em Excel." },
        { id: "csv", label: "CSV", next: "report_download", keep: ["download", "configuration"], info: "A exportação foi solicitada em CSV." },
        { id: "other", label: "Outro formato", next: "report_download", keep: ["download", "configuration"], info: "A exportação foi solicitada em outro formato." },
      ] },
      report_data_state: { id: "report_data_state", question: "Como os dados aparecem no relatório?", possibleProblems: ["invalid_data", "permission", "configuration"], answers: [
        { id: "empty", label: "Vazio ou sem registros", next: "report_filters", keep: ["invalid_data", "configuration", "permission"], info: "O relatório não apresenta registros para a consulta." },
        { id: "incomplete", label: "Incompleto", next: "report_filters", keep: ["invalid_data", "configuration", "permission"], info: "Parte dos registros esperados não aparece no relatório." },
        { id: "different", label: "Com valores diferentes do esperado", next: "report_filters", keep: ["invalid_data", "configuration"], info: "Os valores exibidos diferem do esperado." },
        { id: "open", label: "Não abre", next: "report_scope", keep: ["processing", "permission", "configuration"], info: "O relatório não chega a abrir para conferência." },
      ] },
      report_scope: { id: "report_scope", question: "Outro usuário consegue gerar o mesmo relatório?", possibleProblems: ["processing", "permission", "configuration"], answers: yesNoUnknown(
        { result: "report_processing", keep: ["processing", "configuration"], info: "A falha ocorre para mais de uma pessoa." },
        { result: "report_permission", keep: ["permission"], info: "A falha parece restrita ao perfil atual." },
        { result: "report_processing", keep: ["processing", "configuration"], info: "Não foi possível comparar com outro usuário." }) },
      report_download: { id: "report_download", question: "O navegador bloqueou pop-up ou download?", possibleProblems: ["download", "configuration"], answers: yesNoUnknown(
        { result: "report_download_blocked", keep: ["download"], info: "O navegador bloqueou a abertura ou o download do arquivo." },
        { result: "report_export", keep: ["configuration", "download"], info: "O navegador não indicou bloqueio de download." },
        { result: "report_export", keep: ["configuration", "download"], info: "Não foi possível confirmar se houve bloqueio no navegador." }) },
      report_filters: { id: "report_filters", question: "Os filtros e o período exibidos estão corretos?", hint: "Ao conferir, considere também empresa, filial e usuário selecionados.", possibleProblems: ["invalid_data", "permission", "configuration"], answers: yesNoUnknown(
        { result: "report_data", keep: ["invalid_data", "configuration"], info: "Os filtros parecem corretos, mas os dados não correspondem." },
        { result: "report_filter", keep: ["configuration"], info: "Os filtros ou o período usado precisam de correção." },
        { result: "report_permission", keep: ["permission", "configuration"], info: "Não foi possível validar os filtros; o perfil pode limitar o conteúdo." }) },
    },
    results: {
      report_processing: { title: "Geração de relatório precisa de verificação", category: "Processamento", priority: "Alta", confidence: 80, causes: [["Processamento do relatório", 80], ["Fila de geração", 13], ["Configuração da rotina", 7]] },
      report_permission: { title: "Perfil pode limitar o acesso ao relatório", category: "Permissão", priority: "Média", confidence: 77, causes: [["Permissão do perfil", 77], ["Escopo dos dados", 15], ["Configuração do relatório", 8]] },
      report_download_blocked: { title: "Download do relatório foi bloqueado pelo navegador", category: "Navegador", priority: "Baixa", confidence: 93, causes: [["Bloqueio de pop-up ou download", 93], ["Extensão do navegador", 5], ["Configuração local", 2]] },
      report_export: { title: "Exportação do relatório não foi concluída", category: "Configuração", priority: "Média", confidence: 75, causes: [["Configuração da exportação", 75], ["Formato do arquivo", 16], ["Navegador", 9]] },
      report_data: { title: "Dados do relatório precisam ser validados", category: "Dados inválidos", priority: "Média", confidence: 83, causes: [["Dados de origem", 83], ["Filtro aplicado", 11], ["Atualização pendente", 6]] },
      report_filter: { title: "Filtros do relatório precisam ser revisados", category: "Configuração", priority: "Baixa", confidence: 89, causes: [["Filtro ou período incorreto", 89], ["Visão salva", 7], ["Regra do relatório", 4]] },
    },
  },
  notifications: {
    id: "notifications",
    name: "Notificações e e-mails",
    keywords: ["notificação", "notificações", "email", "e-mail", "alerta", "aviso", "não recebi", "nao recebi"],
    maxQuestions: 5,
    startNode: "notification_channel",
    problems: ["configuration", "delivery", "permission", "outage"],
    nodes: {
      notification_channel: { id: "notification_channel", question: "Qual aviso não chegou?", hint: "Identificar o canal evita testar configurações que não se aplicam ao caso.", possibleProblems: ["configuration", "delivery", "permission", "outage"], answers: [
        { id: "email", label: "E-mail automático", description: "Confirmações, alertas ou mensagens enviadas por e-mail.", next: "notification_email", keep: ["delivery", "configuration", "outage"], info: "O aviso esperado era um e-mail automático." },
        { id: "system", label: "Notificação dentro do sistema", description: "Aviso exibido no sino ou na central de notificações.", next: "notification_scope", keep: ["configuration", "permission", "outage"], info: "O aviso esperado era uma notificação interna." },
      ] },
      notification_email: { id: "notification_email", question: "O e-mail também não aparece na caixa de spam ou lixo eletrônico?", possibleProblems: ["delivery", "configuration", "outage"], answers: yesNoUnknown(
        { next: "notification_scope", keep: ["delivery", "configuration", "outage"], info: "O e-mail não foi localizado em nenhuma caixa." },
        { result: "notification_spam", keep: ["configuration"], info: "O e-mail foi entregue, mas classificado como spam." },
        { next: "notification_scope", keep: ["delivery", "configuration"], info: "Não foi possível verificar as caixas de e-mail." }) },
      notification_scope: { id: "notification_scope", question: "Outras pessoas deixam de receber o mesmo aviso?", possibleProblems: ["configuration", "delivery", "permission", "outage"], answers: yesNoUnknown(
        { result: "notification_service", keep: ["delivery", "outage", "configuration"], info: "O aviso falha para mais de uma pessoa." },
        { result: "notification_profile", keep: ["permission", "configuration"], info: "A falha parece restrita ao perfil atual." },
        { result: "notification_profile", keep: ["configuration", "delivery", "permission"], info: "Não foi possível confirmar o alcance do problema." }) },
    },
    results: {
      notification_spam: { title: "E-mail entregue, mas classificado como spam", category: "Configuração", priority: "Baixa", confidence: 94, causes: [["Filtro de spam", 94], ["Remetente não confiável", 4], ["Regra da caixa de entrada", 2]] },
      notification_service: { title: "Entrega de notificações precisa de verificação", category: "Entrega", priority: "Média", confidence: 81, causes: [["Serviço de entrega", 81], ["Fila de notificações", 12], ["Configuração do evento", 7]] },
      notification_profile: { title: "Configuração de notificação do perfil precisa ser revisada", category: "Configuração", priority: "Baixa", confidence: 78, causes: [["Preferência do perfil", 78], ["Permissão de visualização", 14], ["Configuração do evento", 8]] },
    },
  },
  general: {
    id: "general",
    name: "Problema geral",
    keywords: [],
    maxQuestions: 5,
    startNode: "general_area",
    problems: ["feature", "permission", "outage", "configuration", "connection"],
    nodes: {
      general_area: { id: "general_area", question: "Em qual parte do sistema o problema aparece?", hint: "Uma descrição ampla é comum. Começamos encontrando a área afetada.", possibleProblems: ["feature", "permission", "outage", "configuration", "connection"], answers: [
        { id: "one", label: "Em uma tela ou função específica", description: "Por exemplo: salvar, buscar, emitir ou consultar.", next: "general_message", keep: ["feature", "permission", "configuration"], info: "O problema está concentrado em uma funcionalidade." },
        { id: "many", label: "Em várias partes do sistema", description: "Mais de uma tela ou ação apresenta a mesma dificuldade.", next: "general_scope", keep: ["outage", "connection", "configuration"], info: "O problema afeta mais de uma parte do sistema." },
        { id: "unsure", label: "Não consigo identificar a área", description: "O problema ocorreu, mas a tela ou ação não ficou clara.", next: "general_message", keep: ["feature", "configuration", "connection"], info: "A área afetada ainda não foi identificada." },
      ] },
      general_message: { id: "general_message", question: "O sistema mostra uma mensagem de erro ou acesso negado?", possibleProblems: ["feature", "permission", "configuration"], answers: yesNoUnknown(
        { next: "general_error_type", keep: ["permission", "configuration", "feature"], info: "Existe uma mensagem que pode orientar a triagem." },
        { next: "general_scope", keep: ["feature", "configuration", "connection"], info: "Não há mensagem visível para orientar a triagem." },
        { next: "general_scope", keep: ["feature", "configuration", "connection"], info: "Não foi possível identificar uma mensagem." }) },
      general_error_type: { id: "general_error_type", question: "O que a mensagem sugere?", possibleProblems: ["feature", "permission", "configuration"], answers: [
        { id: "access", label: "Sem permissão ou acesso negado", result: "general_permission", keep: ["permission"], info: "A mensagem aponta falta de permissão." },
        { id: "data", label: "Campo, regra ou dado inválido", result: "general_configuration", keep: ["configuration"], info: "A mensagem aponta uma regra ou dado que precisa ser revisado." },
        { id: "other", label: "Outro erro ou código técnico", next: "general_scope", keep: ["feature", "configuration"], info: "Há um erro, mas ele não se encaixa nas opções anteriores." },
      ] },
      general_scope: { id: "general_scope", question: "Outras pessoas também encontram o mesmo problema?", possibleProblems: ["feature", "permission", "outage", "configuration", "connection"], answers: yesNoUnknown(
        { result: "general_outage", keep: ["outage", "configuration"], info: "O problema também atinge outras pessoas." },
        { result: "general_feature", keep: ["feature", "permission", "configuration"], info: "O problema parece restrito a uma pessoa ou contexto." },
        { result: "general_feature", keep: ["feature", "configuration", "connection"], info: "O alcance do problema não foi confirmado." }) },
    },
    results: {
      general_permission: { title: "Acesso à funcionalidade precisa ser revisado", category: "Permissão", priority: "Média", confidence: 86, causes: [["Perfil sem acesso", 86], ["Regra de autorização", 10], ["Sessão desatualizada", 4]] },
      general_configuration: { title: "Regra ou configuração precisa de validação", category: "Configuração", priority: "Média", confidence: 77, causes: [["Regra de configuração", 77], ["Dados da operação", 15], ["Versão da funcionalidade", 8]] },
      general_outage: { title: "Problema compartilhado na operação", category: "Indisponibilidade", priority: "Alta", confidence: 74, causes: [["Serviço ou dependência compartilhada", 74], ["Configuração recente", 17], ["Conexão ampla", 9]] },
      general_feature: { title: "Falha localizada em uma funcionalidade", category: "Funcionalidade", priority: "Média", confidence: 70, causes: [["Comportamento da funcionalidade", 70], ["Configuração do contexto", 20], ["Sessão ou navegador", 10]] },
    },
  },
};

export const problemLabels = {
  integration: "Integração", configuration: "Configuração", external_service: "Serviço externo", permission: "Permissão",
  outage: "Indisponibilidade", invalid_data: "Dados inválidos", wrong_password: "Senha incorreta", blocked_account: "Conta bloqueada",
  authentication: "Autenticação", connection: "Conexão", general: "Problema geral", network: "Rede", single_user: "Ambiente do usuário",
  feature: "Funcionalidade específica", partial_outage: "Indisponibilidade parcial", overload: "Sobrecarga", duplicate: "Dados duplicados",
  processing: "Processamento", download: "Download", delivery: "Entrega",
};
