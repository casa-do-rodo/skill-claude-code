---
name: supabase-schema-testing
description: Use when creating or modifying Supabase schemas, migrations, RLS policies, or pgvector indexes — defines how to apply the RED-GREEN-REFACTOR cycle to Supabase instead of traditional unit tests. Use before applying any migration to production, when adding RLS policies, or when setting up pgvector for similarity search.
---

# Supabase Schema Testing

## Overview

Migrations e policies não têm unit tests tradicionais — validação acontece escrevendo as queries que você vai usar ANTES de criar as tabelas, e verificando que as migrations aplicam limpas.

**REQUIRED BACKGROUND:** Entenda `test-driven-development` primeiro. Esta skill estende o ciclo para Supabase.

**Core principle:** Escreva a query que você precisa ANTES de criar a tabela. Se a query não é clara, o schema não está pronto.

## O Ciclo

### RED — Escreva a query antes do schema

Antes de criar qualquer tabela ou index:

1. **Escreva a query que o sistema vai executar:**
   ```sql
   -- Exemplo: busca de registros por status e categoria
   SELECT id, nome, metadata
   FROM minha_tabela
   WHERE categoria = 'valor' AND status = 'ativo'
   ORDER BY created_at DESC;
   ```

2. **Execute no Supabase SQL Editor** — deve falhar com "relation does not exist".

3. **Se a query não é clara**, o requisito não está entendido. Volte à especificação.

Isso é o RED: a query existe, falha por falta de schema.

### GREEN — Crie o schema mínimo para a query passar

1. **Escreva a migration** com apenas o necessário:
   ```sql
   CREATE TABLE minha_tabela (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     nome text NOT NULL,
     categoria text NOT NULL,
     status text NOT NULL DEFAULT 'ativo',
     metadata jsonb,
     created_at timestamptz DEFAULT now()
   );
   ```

2. **Aplique via Supabase MCP** ou SQL Editor
3. **Execute a query do RED** — deve retornar resultado (mesmo que vazio)
4. **Verifique com dados de teste** — insira 2-3 rows e confirme o resultado

```
✅ Query retorna → schema correto → GREEN
❌ Query ainda falha → migration incompleta → investigue
```

### REFACTOR — Adicione índices e constraints após GREEN

Só depois de GREEN confirmado:
- Adicionar índices para performance (consulte `supabase-postgres-best-practices`)
- Adicionar constraints (NOT NULL, CHECK, FK)
- Ajustar tipos de dados
- Não adicione colunas novas — isso é RED de novo

## Padrões por tipo de schema

### Tabelas relacionais

```
RED:   Escreva as queries de INSERT, SELECT e UPDATE que o sistema vai usar
       Inclua as queries de JOIN se houver relações entre tabelas

GREEN: Migration aplica, queries funcionam com dados de teste
       Verifique que o workflow/backend consegue ler e escrever corretamente
```

### RLS Policies (multi-tenant / controle de acesso)

```
RED:   Defina quem pode ver o quê em linguagem natural:
       "usuário X só vê registros do seu tenant"
       "admin vê tudo"
       "usuário anônimo não vê nada"

GREEN: Crie a policy mínima:
       CREATE POLICY "usuario_ve_proprio_tenant" ON tabela
       FOR SELECT USING (tenant_id = auth.uid());

       Teste com diferentes contextos de autenticação:
       SET app.current_tenant = 'tenant_a';
       SELECT * FROM tabela; -- deve retornar só registros do tenant_a

❌ Se viu registros de outro tenant: policy quebrada, não é GREEN
```

### pgvector / Similarity search

```
RED:   Escreva a query de busca semântica antes de criar a tabela:
       SELECT id, conteudo,
              1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similaridade
       FROM base_conhecimento
       ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
       LIMIT 5;
       -- deve falhar: "relation does not exist"

GREEN: Crie a tabela com a extensão pgvector:
       CREATE TABLE base_conhecimento (
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         conteudo text NOT NULL,
         embedding vector(1536)  -- ajuste a dimensão ao modelo usado
       );
       CREATE INDEX ON base_conhecimento
       USING hnsw (embedding vector_cosine_ops);

       Insira 3-5 embeddings de teste e execute a query de similarity search.
       Verifique que os resultados mais similares aparecem primeiro.

REFACTOR: Ajuste parâmetros do índice HNSW (m, ef_construction)
          conforme necessidade de performance vs. recall.
          Consulte supabase-postgres-best-practices.
```

### Queues / Filas de processamento

```
RED:   Escreva as queries de enqueue, dequeue e atualização de status:
       INSERT INTO fila (payload, status) VALUES ($1, 'pendente');
       SELECT * FROM fila WHERE status = 'pendente' LIMIT 1 FOR UPDATE SKIP LOCKED;
       UPDATE fila SET status = 'processado' WHERE id = $1;

GREEN: Migration aplica, queries funcionam sem deadlock
       Teste com múltiplas execuções concorrentes (SKIP LOCKED é crítico aqui)
```

## Antes de aplicar em produção (checklist)

- [ ] Query escrita e testada antes da migration existir
- [ ] Migration aplica limpa em ambiente fresh (sem erros)
- [ ] Dados de teste inseridos e queries verificadas
- [ ] RLS policies testadas com múltiplos contextos de autenticação (se aplicável)
- [ ] pgvector: similarity search retorna resultados na ordem correta
- [ ] Rollback verificado: a migration pode ser desfeita?
- [ ] `supabase-postgres-best-practices` consultada para índices e tipos

**Se algum item estiver em branco: não aplique em produção.**

## Erros comuns

| Erro | Realidade |
|---|---|
| "Criei a tabela, vou escrever as queries depois" | Sem query definida, o schema é um chute. Escreva primeiro. |
| "RLS parece certa, não precisa testar" | RLS errada expõe dados de outros tenants. Teste sempre. |
| "O embedding vai funcionar, é padrão" | Dimensões do modelo variam. Execute a query de teste antes. |
| "Migration subiu sem erro" | Subir sem erro ≠ schema correto. Execute as queries. |
| "Índice depois, quando precisar" | Índice em tabela grande com dados = lock longo. Planeje antes. |

## Integração com outras skills

- **`supabase`** — use para contexto de RLS, Auth, Data API e CLI
- **`supabase-postgres-best-practices`** — use na fase REFACTOR para índices e otimização
- **`n8n-workflow-testing`** — para validar que o workflow consegue usar o schema criado
- **`verification-before-completion`** — obrigatório antes de declarar a migration pronta
