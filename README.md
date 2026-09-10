# Suporte Claro — MVP de diagnóstico guiado

O Suporte Claro é um MVP criado para transformar relatos incompletos em diagnósticos mais claros, soluções seguras e chamados estruturados. A proposta é reduzir a necessidade de a equipe pedir as mesmas informações várias vezes e ajudar a pessoa usuária antes da abertura de um chamado.

## Problema abordado

Pessoas usuárias frequentemente relatam problemas de forma curta, sem informar contexto, mensagens de erro, alcance ou tentativas já feitas. Isso aumenta o tempo de triagem e gera conversas repetitivas com o suporte.

## Principais fluxos

1. A pessoa descreve o problema com suas próprias palavras.
2. O MVP seleciona uma árvore de diagnóstico compatível e faz perguntas objetivas.
3. O resultado apresenta causas prováveis e soluções locais seguras.
4. Se necessário, o chamado é criado com relato, respostas, tentativas, evidência e contexto técnico.
5. O suporte acompanha a fila, altera status, solicita detalhes e registra comentários.
6. Após a resolução, a pessoa usuária pode avaliar o atendimento.

## Telas e perfis

- **Início:** criação de um novo diagnóstico.
- **Diagnóstico:** perguntas adaptadas para nota fiscal, login, cadastro, relatórios, notificações, desempenho e situações gerais.
- **Resultado:** análise demonstrativa, soluções sugeridas, tentativas e criação do chamado.
- **Meus chamados:** visão restrita aos chamados da pessoa usuária.
- **Central de suporte:** visão geral, chamados, problemas comuns e insights.

O MVP possui dois perfis simulados:

- `usuario`: cria e acompanha apenas os próprios chamados.
- `suporte`: acompanha todos os chamados e altera status.

A troca de perfil existe apenas para demonstrar os dois fluxos; ela não representa autenticação real.

## Recursos do MVP

- perguntas adaptativas a partir do relato inicial;
- seleção local de soluções seguras;
- histórico de soluções apresentadas e tentativas feitas;
- anexos de imagem locais;
- comentários, status e histórico do chamado;
- avaliação após resolução;
- detecção local de chamados parecidos;
- métricas demonstrativas;
- tema claro, escuro, seguir sistema, alto contraste, preto e branco e tamanho de fonte;
- avisos de segurança e proteção demonstrativa de rotas.

## Como executar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
npm run dev
```

Abra `http://localhost:5173` no navegador. Para validar a versão de entrega:

```bash
npm run build
```

## Dados demonstrativos

Os chamados, comentários, avaliações, anexos e preferências do MVP ficam neste navegador. A central também usa exemplos fixos para tornar a demonstração mais completa.

No painel de suporte, o botão **Restaurar dados demonstrativos** remove apenas os dados criados localmente durante a demonstração. Os exemplos fixos não são alterados.

## Tecnologias

- React e Vinext;
- Tailwind CSS;
- componentes de interface baseados em Shadcn;
- Lucide Icons;
- `localStorage` e `sessionStorage` para dados demonstrativos.

## Equipe — Grupo 8

- Estela Fiorentin — Design • Pesquisa
- Júlio César Diezel — Comunicação • Pesquisa
- Victor Gabriel Cappellesso — Pesquisa
- Gabriel Decezere Bevilaqua — Pesquisa
- Kaua Gabriel Lorenssetti — Dev
- Endrio Ruan de Matos — Dev • Design
- Vitor Dezem — Pesquisa
- André Luiz Gabiatti — Pesquisa
- Luiz Eduardo Rosa Libano — Design • Comunicação
- Luan Carlos Martini — Dev • Pesquisa

## Limitações conhecidas

Este é um MVP demonstrativo. `localStorage` não substitui autenticação, autorização ou persistência segura. Os dados podem ser alterados por quem controla o navegador e não devem conter informações reais ou sensíveis.

Não envie senhas, códigos de confirmação, chaves de acesso, documentos ou dados financeiros nos relatos ou anexos.

## Próximos passos para produção

- autenticação real;
- API com validação de permissões no servidor;
- banco de dados para chamados, comentários e métricas;
- armazenamento seguro de anexos;
- logs de auditoria;
- monitoramento de erros e desempenho;
- testes com pessoas usuárias e leitores de tela reais.
