const rows = [
  ["#1042", "Falha na emissão de nota fiscal", "Integração", "Alta", "Serviço externo", 87, "Aberto", 180, "Marina Costa", "Operadora", "3.2"],
  ["#1041", "Conta bloqueada após tentativas", "Acesso", "Alta", "Bloqueio por tentativas", 92, "Em análise", 142, "Carlos Lima", "Administrador", "3.2"],
  ["#1040", "Sistema lento no faturamento", "Desempenho", "Média", "Volume de dados", 78, "Aberto", 276, "Rafael Alves", "Operador", "3.1"],
  ["#1039", "Erro ao autenticar usuário", "Autenticação", "Alta", "Serviço de autenticação", 81, "Resolvido", 205, "Ana Souza", "Gestora", "3.2"],
  ["#1038", "Nota parada em processamento", "Serviço externo", "Alta", "Fila do provedor", 82, "Em análise", 231, "Paulo Reis", "Operador", "3.0"],
  ["#1037", "Acesso lento em uma estação", "Rede", "Média", "Conexão local", 83, "Resolvido", 194, "Bia Martins", "Operadora", "3.1"],
  ["#1036", "Sem permissão para emitir nota", "Permissão", "Média", "Perfil sem permissão", 79, "Aberto", 168, "João Prado", "Operador", "3.2"],
  ["#1035", "Lentidão geral no início da tarde", "Capacidade", "Alta", "Sobrecarga", 88, "Resolvido", 322, "Luiza Melo", "Administradora", "3.2"],
  ["#1034", "Campo fiscal rejeitado", "Dados inválidos", "Média", "Campo obrigatório", 74, "Em análise", 151, "Iara Nunes", "Operadora", "3.1"],
  ["#1033", "Tela de login não carrega", "Indisponibilidade", "Alta", "Serviço indisponível", 79, "Resolvido", 284, "Diego Luz", "Operador", "3.0"],
  ["#1032", "Relatório demora para abrir", "Desempenho", "Baixa", "Processamento", 76, "Aberto", 249, "Nina Sales", "Gestora", "3.2"],
  ["#1031", "Falha intermitente na emissão", "Integração", "Alta", "Comunicação externa", 84, "Resolvido", 217, "Otávio Cruz", "Administrador", "3.1"],
];

export const mockTickets = rows.map((row, index) => ({
  id: row[0], userId: index === 0 ? "usr-marina-costa" : `usr-mock-${index}`, title: row[1], description: `Usuário informou: “${row[1]}”.`, category: row[2], priority: row[3],
  probableCause: row[4], confidence: row[5], status: row[6], elapsedSeconds: row[7],
  user: { name: row[8], role: row[9], version: row[10] }, date: new Date(Date.now() - index * 5_400_000).toISOString(),
  causes: [[row[4], row[5]], ["Configuração relacionada", Math.max(8, 100 - row[5] - 5)], ["Outra hipótese", 5]],
  information: ["O contexto da tentativa foi informado.", "O alcance do problema foi identificado.", "A frequência da falha foi registrada."],
  analysis: `As respostas apontam para ${row[4].toLocaleLowerCase("pt-BR")}. O chamado já contém contexto suficiente para iniciar a verificação sem repetir as perguntas básicas. Análise demonstrativa baseada em regras.`,
  actions: ["Consultar registros do horário informado", "Reproduzir o caminho descrito", "Atualizar o usuário após a primeira verificação"],
  answers: [
    { question: "Qual ação estava sendo realizada?", answer: row[1], information: "A ação afetada foi identificada." },
    { question: "O problema acontece sempre?", answer: index % 2 ? "Acontece às vezes" : "Sim", information: "A frequência foi registrada." },
    { question: "Outros usuários são afetados?", answer: index % 3 ? "Não sei" : "Sim", information: "O alcance foi investigado." },
  ],
}));
