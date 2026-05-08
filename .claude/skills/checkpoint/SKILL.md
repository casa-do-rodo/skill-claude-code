---
name: checkpoint
description: Save current mid-session state for recovery after context compaction.
allowed-tools: Write
---

Write a checkpoint snapshot of the current session state. Use your knowledge of what is happening right now — you are here.

**Path:** `{project_root}/.remember/checkpoint.md` (always overwrite; create `.remember/` if it does not exist).

Format:

# Checkpoint

## Task
{What is being worked on right now — 1-2 lines, present tense}

## Progress
{What is done in this task / what is not yet done — 2-3 lines}

## Files
{Key files only — max 5. Files open or modified in this task}

## Context
{Non-obvious state: decisions made, current approach, discovered gotchas. Example: "Decided to use X instead of Y because Z."}

Rules:

- Max 20 lines total
- Present tense throughout ("I am implementing...", "We decided...")
- No "Next" section — that belongs to remember:remember
- Overwrite every time — multiple checkpoints per session is normal and expected
- Say "Checkpoint salvo." when done — nothing else
