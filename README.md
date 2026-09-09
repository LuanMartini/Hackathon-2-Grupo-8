# Claro Support

MVP de diagnóstico guiado para chamados de suporte, desenvolvido pelo Grupo 8 no Hackathon 2.

## O que o projeto faz

A pessoa usuária descreve um problema com suas próprias palavras. O sistema identifica o tema, apresenta perguntas relacionadas ao contexto e organiza as respostas em um chamado mais completo para a equipe de suporte.

Temas disponíveis no MVP:

- Emissão de nota fiscal
- Acesso à conta
- Lentidão do sistema
- Cadastro de clientes ou usuários
- Relatórios e exportações
- Notificações e e-mails
- Problemas gerais

## Principais fluxos

1. A pessoa descreve o que aconteceu.
2. O diagnóstico seleciona o tema mais adequado.
3. As perguntas refinam as possíveis causas.
4. O sistema mostra uma hipótese, prioridade e próximos passos.
5. Um chamado estruturado pode ser criado e acompanhado.

O MVP também possui uma central para a equipe de suporte, com fila de chamados, detalhes, métricas e insights.

## Perfis demonstrativos

- `usuario`: cria e acompanha somente os próprios chamados.
- `suporte`: acessa a central, a lista completa de chamados, métricas e insights.

> A proteção atual é demonstrativa e usa dados locais no navegador. Em produção, autenticação e autorização devem ser validadas no servidor.

## Tecnologias

- React
- Vinext / Vite
- Tailwind CSS
- Componentes baseados em shadcn

## Como executar localmente

### Pré-requisitos

- Node.js 22 ou superior

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra o endereço informado no terminal, normalmente `http://localhost:5173`.

### Compilação

```bash
npm run build
```

## Estrutura principal

```text
app/          telas e rotas
components/   componentes reutilizáveis
data/         árvores de diagnóstico e dados demonstrativos
lib/          regras de seleção, adaptação e armazenamento local
public/       arquivos estáticos
```

## Limitações do MVP

- Não possui banco de dados ou backend real.
- Chamados e perfis são simulados localmente.
- Não envia e-mails ou notificações reais.
- Não integra com sistemas fiscais ou outros serviços externos.

## Próximos passos

- Implementar autenticação real.
- Criar API e banco de dados.
- Validar permissões no servidor.
- Integrar notificações e serviços externos.
