# Checkpoint Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a mid-session checkpoint skill that saves current work state to `.remember/checkpoint.md` and survives context compaction via a PreCompact hook.

**Architecture:** Three components: (1) a SKILL.md Claude invokes to write `.remember/checkpoint.md`; (2) a PreCompact hook in `.claude/settings.json` that injects the checkpoint into the compaction summary; (3) updates to `CLAUDE.md` with session-start read instructions and proactive trigger signals.

**Tech Stack:** Markdown (skill), JSON (settings hook), Windows cmd (hook command)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.agents/skills/checkpoint/SKILL.md` | Create | Skill definition — instructs Claude to write checkpoint |
| `.claude/settings.json` | Create | PreCompact hook — reads and injects checkpoint on compaction |
| `CLAUDE.md` | Modify | Session-start read + proactive trigger signals |

---

### Task 1: Create the checkpoint skill

**Files:**
- Create: `.agents/skills/checkpoint/SKILL.md`

- [ ] **Step 1: Create the skill file**

Create `.agents/skills/checkpoint/SKILL.md` with this exact content:

```markdown
---
name: checkpoint
description: Save current mid-session state for recovery after context compaction.
allowed-tools: Write
---

Write a checkpoint snapshot of the current session state. Use your knowledge of what is happening right now — you are here.

**Path:** `{project_root}/.remember/checkpoint.md` (always overwrite).

Format:

# Checkpoint

## Task
{What is being worked on right now — 1-2 lines, present tense}

## Progress
{What is done in this task / what is not yet done — 2-3 lines}

## Files
{Key files open or modified in this task}

## Context
{Non-obvious state: decisions made, current approach, discovered gotchas}

Rules:

- Max 15 lines total
- Present tense throughout ("I am implementing...", "We decided...")
- No "Next" section — that belongs to remember:remember
- Overwrite every time — multiple checkpoints per session is normal and expected
- Say "Checkpoint salvo." when done — nothing else
```

- [ ] **Step 2: Verify the file was created**

Confirm `.agents/skills/checkpoint/SKILL.md` exists and has the `name: checkpoint` frontmatter.

---

### Task 2: Add PreCompact hook

**Files:**
- Create: `.claude/settings.json`

Note: `.claude/settings.local.json` already exists with permissions — do NOT modify it. Create a separate `.claude/settings.json` for project-level hooks.

- [ ] **Step 1: Create `.claude/settings.json` with the PreCompact hook**

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "if exist .remember\\checkpoint.md (type .remember\\checkpoint.md)"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Verify the JSON is valid**

Read the file back and confirm the structure is correct — no trailing commas, no missing brackets.

---

### Task 3: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

Two changes: (1) add `checkpoint.md` to the Session Continuity section; (2) add a new Checkpoint section with trigger signals.

- [ ] **Step 1: Update the Session Continuity section**

Find the existing Session Continuity section and replace it with:

```markdown
## Session Continuity

At the start of every session, read these files if they exist — in this order:
1. `.remember/checkpoint.md` — mid-session state (most recent task context)
2. `.remember/remember.md` — end-of-session handoff (what came before)

Use them together to restore full context before doing anything else.

The `.remember/` folder is managed by the `remember:remember` plugin (dpt-plugins). Key files:
- `remember.md` — manual handoff written via `/remember:remember`
- `checkpoint.md` — mid-session snapshot written via `/checkpoint`
- `now.md` — autonomous save of current state
- `today-YYYY-MM-DD.md` — daily activity summary
```

- [ ] **Step 2: Add the Checkpoint trigger section**

Add this new section immediately after Session Continuity:

```markdown
## Checkpoint

Invoke the `checkpoint` skill proactively — without waiting to be asked — when:
- 15+ tool calls have happened in this session
- You are about to start a new major subtask
- A complex decision was just made that affects the rest of the work
- The conversation feels long and context-heavy

Run it silently — no need to announce it. Just invoke and continue working.
```

- [ ] **Step 3: Verify CLAUDE.md**

Read the full CLAUDE.md and confirm:
- Session Continuity section lists both `checkpoint.md` and `remember.md`
- Checkpoint section exists with the four trigger signals
- No duplicate sections, no broken formatting
