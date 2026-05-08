# Checkpoint Skill — Design Spec

**Date:** 2026-05-08  
**Status:** Approved

---

## Purpose

A mid-session state preservation skill for Claude Code. Saves a focused snapshot of current work to `.remember/checkpoint.md` so that if context compaction occurs, the state survives and Claude can reorient immediately after.

Complements `remember:remember` (end-of-session handoff) — does not replace it.

---

## Architecture

Three components working together:

```
[Skill]    Claude writes .remember/checkpoint.md (mid-session, any time)
[Hook]     PreCompact reads checkpoint.md → injects into compaction summary
[CLAUDE.md] Defines trigger signals + instructs Claude to read on session start
```

---

## Component 1: Skill

**File:** `.agents/skills/checkpoint/SKILL.md`  
**Invocation:** User via `/checkpoint`, or Claude proactively via Skill tool  
**Allowed tools:** `Write`

**Output file:** `.remember/checkpoint.md` (always overwrite — only latest state matters)

**Format:**

```
# Checkpoint

## Task
{What is being worked on right now — 1-2 lines, present tense}

## Progress
{What's done in this task / what's not yet done — 2-3 lines}

## Files
{Key files open or modified in this task}

## Context
{Non-obvious state: decisions made, current approach, discovered gotchas}
```

**Rules:**
- Max 15 lines total
- Present tense throughout
- No "Next" section (that belongs to `remember:remember`)
- Overwrites on every invocation — multiple checkpoints per session is normal
- Says "Checkpoint salvo." when done, nothing else

**Contrast with `remember:remember`:**

| | `checkpoint` | `remember:remember` |
|---|---|---|
| When | Mid-session, any time | End of session |
| Focus | Where we are now | What comes next |
| Has "Next" | No | Yes |
| Frequency | Multiple per session | Once |
| Overwrites | Yes | Yes |

---

## Component 2: PreCompact Hook

**Config:** `.claude/settings.json` → `hooks.PreCompact`

**Command (Windows cmd):**
```
if exist .remember\checkpoint.md (type .remember\checkpoint.md)
```

**Behavior:**
- Runs before every compaction event
- If `checkpoint.md` exists: outputs its content to stdout → Claude Code injects it into the compaction summary
- If `checkpoint.md` does not exist: outputs nothing → compaction proceeds normally
- No side effects, no writes

---

## Component 3: CLAUDE.md Instructions

Two additions to `CLAUDE.md`:

**1. Session start — read checkpoint if it exists:**
Update existing "Session Continuity" section to also read `.remember/checkpoint.md`.

**2. Trigger signals — when Claude invokes proactively:**
```
Invoke the checkpoint skill when:
- 15+ tool calls have happened in this session
- You're about to start a new major subtask
- A complex decision was just made that affects the rest of the work
- The conversation feels long and context-heavy

Run it silently — no need to announce it. Just invoke and continue.
```

---

## File Layout

```
.agents/skills/checkpoint/SKILL.md     ← skill definition
.remember/checkpoint.md                ← written by skill, read by hook
.claude/settings.json                  ← PreCompact hook config
CLAUDE.md                              ← trigger instructions + session start read
```

---

## Out of Scope

- Stop hook for automatic shell-based snapshots (no Claude reasoning = low value)
- Appending/versioned checkpoints (recency is all that matters)
- Integration with `today-*.md` or `now.md` from the remember plugin
