---
name: n8n-workflow-testing
description: Use when building or validating n8n workflows — defines how to apply the RED-GREEN-REFACTOR cycle to n8n instead of traditional unit tests. Use before activating any workflow, when verifying AI agent behavior, or when debugging unexpected outputs. Required before claiming a workflow is complete.
---

# n8n Workflow Testing

## Overview

n8n workflows não têm unit tests tradicionais — validação acontece através de execução controlada com inputs conhecidos e outputs esperados. Esta skill adapta o ciclo RED-GREEN-REFACTOR para n8n.

**REQUIRED BACKGROUND:** Entenda `test-driven-development` primeiro. Esta skill estende o ciclo para n8n — mesma disciplina, ferramentas diferentes.

**Core principle:** Defina o comportamento esperado ANTES de construir. Nunca ative um workflow que não foi testado manualmente com inputs controlados.

## O Ciclo

### RED — Defina o contrato antes de construir

Antes de tocar um único node:

1. **Escreva o contrato** (na task, spec ou descrição):
   ```
   Input:  { "campo": "valor_de_teste" }
   Output: { "resultado": "valor_esperado" }
   Side effects: nenhum / escreve em tabela X / envia mensagem
   ```

2. **Identifique a condição de falha** — o que "quebrado" parece?
   - Workflow retorna erro? Output errado? Node não executa?

3. **Monte os dados de teste** — crie pin data com inputs reais antes de construir os nodes.

Se você não consegue definir o output esperado, você não entendeu o requisito. Pare e volte à especificação.

### GREEN — Execute com inputs controlados

1. **Use pin data** em cada node de entrada (Webhook, Schedule Trigger, Manual Trigger)
2. **Execute manualmente** (botão "Test workflow") antes de ativar
3. **Verifique o output** contra o contrato definido no RED
4. **Teste todos os branches** — se o workflow tem IF/Switch, teste cada caminho

```
✅ Workflow executou → output bate com contrato → GREEN
❌ Output diverge do contrato → ainda RED, investigue
```

### REFACTOR — Otimize após GREEN

Só depois de GREEN confirmado:
- Remover nodes desnecessários
- Consolidar Code nodes redundantes
- Ajustar error handling
- Não adicionar behavior novo — isso é RED de novo

## Padrões por tipo de workflow

### AI Agent workflows

```
RED:   Defina 3-5 prompts de teste cobrindo casos principais:
       - saudação / intent reconhecida
       - pergunta sobre produto/serviço
       - solicitação fora do escopo (deve recusar ou escalar)

GREEN: Execute cada prompt, verifique se resposta está dentro do esperado.
       Confirme que o agente não responde sobre tópicos proibidos.
       Use n8n-mcp-tools-expert ao criar/validar os nodes.
```

### Scheduled tasks

```
RED:   Defina: quantos registros afetados, tabela/serviço alvo,
       formato do resultado esperado (ex: embeddings regenerados)

GREEN: Execute manualmente, verifique logs e efeito colateral esperado
       (ex: novos registros aparecem na busca semântica)
```

### Webhook / Database sync flows

```
RED:   Defina payload de entrada e estado esperado no destino após execução
       (ex: registro criado/atualizado em tabela X com campos Y)

GREEN: Dispare webhook com payload de teste, verifique destino
       Use supabase-schema-testing para validar o lado do banco
```

### HTTP API integration

```
RED:   Defina: endpoint chamado, payload enviado, resposta esperada
       Documente o que deve acontecer se a API retornar erro

GREEN: Execute com credenciais de teste, verifique response code e body
       Teste o caminho de erro simulando falha da API
```

## Antes de ativar o workflow (checklist)

- [ ] Contrato input/output documentado
- [ ] Teste manual executado com pin data
- [ ] Todos os branches do IF/Switch testados
- [ ] Caminho de erro testado (o que acontece quando um node falha?)
- [ ] Workflow validado via `n8n-validation-expert` se criado via MCP

**Se algum item estiver em branco: não ative.** Workflow em produção sem teste = bug esperando acontecer.

## Erros comuns

| Erro | Realidade |
|---|---|
| "Testei manualmente, funcionou" | Uma execução não é teste. Cubra edge cases e caminhos de erro. |
| "O workflow é simples, não precisa de teste" | Workflows simples quebram em prod por inputs inesperados. |
| "Vou testar depois de ativar" | Tarde demais. Dados reais entram antes do teste. |
| "O n8n não tem testes formais" | Tem: pin data + execução manual + verificação de output. Use. |

## Integração com outras skills

- **`n8n-mcp-tools-expert`** — use ao criar/modificar nodes via MCP
- **`n8n-validation-expert`** — valide o workflow antes de considerar GREEN
- **`n8n-workflow-patterns`** — padrões arquiteturais por tipo de workflow
- **`supabase-schema-testing`** — para workflows que escrevem/leem do Supabase
- **`verification-before-completion`** — obrigatório antes de declarar o workflow pronto
