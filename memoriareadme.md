# Sistema de Memória — Como Funciona

Este projeto usa duas camadas de memória complementares. Cada uma tem escopo e ciclo de vida diferentes.

---

## Camada 1 — Auto-memory do Claude (permanente)

**Onde:** `C:\Users\Carlos\.claude\projects\...\memory\`

Gerenciada pelo próprio Claude Code. Persiste indefinidamente entre sessões e projetos. Contém arquivos `.md` indexados em `MEMORY.md`.

| Arquivo | Conteúdo |
|---|---|
| `user_profile.md` | Quem é Carlos, nível técnico, estilo de comunicação |
| `project_context.md` | Skills instaladas, landing pages, histórico de sessões, pendentes |
| `feedback_preferences.md` | O que não fazer, o que repetir, preferências confirmadas |

**Quando é usado:** Claude lê o `MEMORY.md` no início de cada sessão (via system context). Atualizado pelo Claude durante a conversa quando algo relevante é aprendido.

**Risco:** Nunca sobrescrito por ferramentas externas. Estável.

---

## Camada 2 — Plugin remember (memória de sessão)

**Onde:** `.remember/` na raiz do projeto

Gerenciada pelo plugin `remember@dpt-plugins` (v0.7.1). Opera via hooks do Claude Code.

### Arquivos e ciclo de vida

| Arquivo | Quem escreve | Quando é lido | Comportamento |
|---|---|---|---|
| `remember.md` | Claude via `/remember:remember` | Início da sessão | **One-shot:** injetado pelo hook, depois apagado. Estará vazio se lido manualmente. |
| `checkpoint.md` | Claude via `/checkpoint` | Início da sessão (manual) + PreCompact | Sobrescrito a cada checkpoint. Não apagado pelo plugin. |
| `now.md` | Haiku automático (PostToolUse hook) | Início da sessão | Acumula resumos. Comprimido a cada hora em `today-*.md`. |
| `today-YYYY-MM-DD.md` | NDC compression (Haiku) | Início da sessão | Arquivo diário comprimido. Fica permanente. |

### Hooks ativos

| Hook | Script | O que faz |
|---|---|---|
| `SessionStart` | `session-start-hook.sh` | Injeta `remember.md`, `now.md`, `today-*.md` no contexto. Apaga `remember.md` após injeção. |
| `PostToolUse` | `post-tool-hook.sh` | A cada 50 linhas de JSONL, chama Haiku para sumarizar e escrever em `now.md`. |
| `PreCompact` (projeto) | PowerShell inline | Injeta `checkpoint.md` no contexto antes da compactação de contexto. |

### Configuração

`config.json` em `~/.claude/plugins/cache/dpt-plugins/remember/0.7.1/config.json`

Timezone configurado para `America/Sao_Paulo`. **Atenção:** esse arquivo fica no cache do plugin e pode ser sobrescrito em atualizações. Se os timestamps voltarem errados, recriar o arquivo.

---

## Camada 2b — Skill checkpoint (mid-session)

**Onde:** `.claude/skills/checkpoint/SKILL.md`

Skill manual acionada via `/checkpoint`. Escreve um snapshot conciso da sessão em `.remember/checkpoint.md`. Serve como âncora durante contextos longos e é injetado pelo PreCompact hook.

**Diferença do `remember.md`:** checkpoint é foco em "o que está acontecendo agora" (sem Next). `remember.md` é o handoff completo com State + Next.

---

## Fluxo por sessão

```
INÍCIO
  └─ SessionStart hook injeta: remember.md (apaga depois) + now.md + today-*.md
  └─ Claude lê: checkpoint.md (manualmente, se existir)
  └─ Claude lê: MEMORY.md (auto-memory)

DURANTE
  └─ PostToolUse: Haiku sumariza sessão → now.md (a cada 50 linhas JSONL)
  └─ /checkpoint: snapshot manual → checkpoint.md
  └─ PreCompact: injeta checkpoint.md antes de compactar contexto

FIM
  └─ /remember:remember: handoff manual → remember.md (será injetado na próxima sessão)
```

---

## Status atual

| Componente | Status |
|---|---|
| Auto-memory (MEMORY.md + arquivos) | ✅ Estável |
| Plugin remember (hooks) | ✅ Estável |
| Timezone (America/Sao_Paulo) | ✅ Corrigido — aguardando validação no próximo save |
| checkpoint.md | ✅ Atualizado |
| remember.md | ✅ Escrito (será consumido na próxima sessão) |
| CLAUDE.md | ✅ Corrigido (removida instrução errada de leitura do remember.md) |

---

## O que cada camada cobre

| Pergunta | Camada 1 (auto-memory) | Camada 2 (plugin) |
|---|---|---|
| "Quem é Carlos?" | ✅ | ❌ |
| "O que aconteceu nesta sessão?" | ❌ | ✅ (now.md) |
| "Onde paramos ontem?" | ❌ | ✅ (remember.md) |
| "O que estava sendo feito antes de compactar?" | ❌ | ✅ (checkpoint.md) |
| "Quais skills estão instaladas?" | ✅ | ❌ |
| "Qual o próximo passo do projeto?" | ✅ (project_context) | ✅ (remember.md) |
