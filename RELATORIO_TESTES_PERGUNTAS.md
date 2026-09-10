# Relatório de testes das perguntas do diagnóstico

**Projeto:** Suporte Claro — MVP de diagnóstico guiado  
**Data:** 10 de setembro de 2026  
**Resultado geral:** Aprovado, com observações para evolução

## Objetivo

Validar todas as perguntas, respostas, ramificações e resultados cadastrados nas sete árvores de diagnóstico do MVP. O teste percorreu programaticamente cada alternativa possível até a conclusão do diagnóstico.

## Resumo da cobertura

| Árvore | Perguntas | Sim/Não/Não sei | Seleção contextual | Respostas testadas | Resultados | Caminhos concluídos | Menor caminho | Maior caminho |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Nota fiscal | 9 | 7 | 2 | 28 | 5 | 255 | 4 | 6 |
| Login e acesso | 8 | 7 | 1 | 25 | 5 | 126 | 3 | 5 |
| Lentidão | 8 | 8 | 0 | 24 | 7 | 225 | 4 | 5 |
| Cadastro | 7 | 6 | 1 | 21 | 6 | 81 | 3 | 5 |
| Relatórios e exportações | 11 | 6 | 5 | 37 | 6 | 1.035 | 5 | 6 |
| Notificações e e-mails | 5 | 4 | 1 | 14 | 3 | 84 | 3 | 5 |
| Problema geral | 6 | 4 | 2 | 18 | 4 | 183 | 3 | 6 |
| **Total** | **54** | **42** | **12** | **167** | **36** | **1.989** | **3** | **6** |

## O que foi verificado em cada caminho

- A árvore selecionada corresponde ao relato inicial.
- Toda pergunta possui texto e alternativas.
- Toda alternativa possui identificação, rótulo, informação coletada e destino válido.
- A pergunta base continua preservada no histórico.
- A pergunta adaptada ao contexto é registrada separadamente.
- Nenhuma árvore entra em ciclo ou chega a uma pergunta inexistente.
- Todos os resultados cadastrados podem ser alcançados.
- O impacto na tarefa é coletado antes do resultado final.
- Nenhum diagnóstico ultrapassa seis perguntas.
- O resultado final contém título, categoria, respostas e informações coletadas.

## Inventário das perguntas testadas

### Nota fiscal

1. A nota chegou a ser criada?
2. A nota foi enviada ao serviço de emissão?
3. Aparece alguma mensagem de erro?
4. Qual destas opções mais se parece com o erro?
5. Outras funções que usam internet estão funcionando?
6. Isso acontece também com outros usuários?
7. O problema acontece em todas as tentativas?
8. O status ficou parado em “processando”?
9. Esse problema impede você de concluir a emissão da nota?

### Login e acesso

1. Aparece alguma mensagem ao tentar entrar?
2. O que a mensagem informa?
3. Você já tentou redefinir a senha?
4. Depois de redefinir, a nova senha foi aceita?
5. Outros usuários também não conseguem entrar?
6. Você consegue abrir outros sites normalmente?
7. A tela chega a carregar antes da falha?
8. Esse problema impede você de entrar e continuar sua tarefa?

### Lentidão

1. A lentidão continua acontecendo neste momento?
2. A lentidão acontece com outros usuários?
3. O sistema inteiro está lento?
4. Outros sites também estão lentos neste dispositivo?
5. Ao abrir em janela anônima ou outro navegador, a lentidão continua?
6. A área afetada chega a parar de responder?
7. A lentidão piora nos horários de maior uso?
8. A lentidão impede você de concluir a tarefa?

### Cadastro

1. Em que momento o cadastro não funciona?
2. Ao tentar novamente com os mesmos dados, o problema se repete?
3. O sistema indica algum campo inválido ou obrigatório?
4. A mensagem menciona que o cadastro já existe?
5. A tela informa falta de permissão?
6. Após atualizar a lista, o novo cadastro aparece?
7. Esse problema impede você de concluir o cadastro?

### Relatórios e exportações

1. Qual relatório você estava consultando?
2. Qual parte do relatório não funcionou?
3. Esse problema começou hoje ou já acontecia antes?
4. Qual formato você escolheu para exportar?
5. O problema também acontece ao exportar em outro formato?
6. Como os dados aparecem no relatório?
7. Existem registros no sistema para o período informado?
8. Outro usuário consegue gerar o mesmo relatório?
9. O navegador bloqueou pop-up ou download?
10. Os filtros e o período exibidos estão corretos?
11. Esse problema impede você de concluir a consulta ou exportação?

### Notificações e e-mails

1. Qual aviso não chegou?
2. O e-mail também não aparece na caixa de spam ou lixo eletrônico?
3. Ao solicitar o aviso novamente, ele continua sem chegar?
4. Outras pessoas deixam de receber o mesmo aviso?
5. A falta desse aviso impede você de continuar a tarefa?

### Problema geral

1. Em qual parte do sistema o problema aparece?
2. O sistema mostra uma mensagem de erro ou acesso negado?
3. O que a mensagem sugere?
4. O problema começou depois de alguma alteração no sistema, navegador ou dispositivo?
5. Outras pessoas também encontram o mesmo problema?
6. Esse problema impede você de concluir a tarefa?

## Relatos contextuais validados

| Relato | Árvore selecionada | Situação |
|---|---|---|
| Não recebi o e-mail de confirmação | Notificações | Aprovado |
| Não consigo emitir a nota fiscal | Nota fiscal | Aprovado |
| Meu relatório mensal veio sem vendas | Relatórios | Aprovado |
| O relatório financeiro está com valores errados | Relatórios | Aprovado |
| Não consigo exportar o relatório para Excel | Relatórios | Aprovado |
| Cliquei para baixar o PDF, mas o arquivo não apareceu | Relatórios | Aprovado |
| O relatório de estoque demora muito para abrir | Relatórios | Aprovado |
| Não consigo salvar o cadastro da empresa | Cadastro | Aprovado |
| Não consigo entrar na conta | Login | Aprovado |
| O sistema está muito lento | Lentidão | Aprovado |
| Algo não funciona | Problema geral | Aprovado |
| Uma anotação não aparece | Problema geral | Aprovado |

## Perguntas adaptativas validadas

- Nota para um cliente: o alvo mencionado é preservado na pergunta.
- Cadastro de uma empresa: o objeto informado aparece na pergunta sobre salvamento.
- Relatório mensal: o período citado aparece nas perguntas de filtros, registros e impacto.
- E-mail de confirmação: o tipo de aviso aparece nas perguntas seguintes.
- Login: a pergunta é ajustada quando o relato menciona entrar na conta.
- Sem contexto confiável: a pergunta original é mantida.

## Outras verificações

- Compilação completa: aprovada.
- Nove rotas existentes: responderam corretamente.
- Qualidade do relato e chamados parecidos: aprovados.
- Catálogo com 16 soluções locais: aprovado.
- Soluções já tentadas sem sucesso não são repetidas.
- Integração indisponível e acesso negado são encaminhados ao suporte.

## Observações importantes

O sistema é chamado de “árvore binária”, mas tecnicamente possui três respostas nas perguntas fechadas: `Sim`, `Não` e `Não sei`. Além disso, 12 perguntas usam seleção contextual com mais opções. Essa combinação é adequada ao MVP porque evita forçar uma resposta incorreta quando a pessoa não possui a informação.

Os testes confirmam a consistência lógica do código, mas não provam que todo diagnóstico corresponde à causa real de um problema. Os níveis de confiança continuam demonstrativos e precisam ser revisados com profissionais de suporte e dados reais.

## Limitações e próximos testes recomendados

1. Realizar testes moderados com pessoas usuárias para verificar se a linguagem é compreendida sem ajuda.
2. Pedir a profissionais de suporte que revisem resultados, prioridades e perguntas que diferenciam causas semelhantes.
3. Medir em casos reais quantos diagnósticos chegam à categoria correta.
4. Registrar abandono por pergunta para encontrar trechos cansativos ou confusos.
5. Em produção, executar classificação, autorização e armazenamento no backend; dados locais podem ser manipulados no navegador.

## Conclusão

Todas as perguntas, alternativas e ramificações cadastradas foram exercitadas. Não foram encontrados caminhos quebrados, ciclos, resultados inexistentes ou diagnósticos acima do limite de seis perguntas. O conjunto está pronto para demonstração, mantendo a ressalva de que a precisão deve ser validada com usuários e profissionais de suporte.
