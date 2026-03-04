# Memory Sync Contract (OpenClaw ↔ Obsidian)

## Source of truth
- **Runtime / agent truth:** OpenClaw workspace files
  - `MEMORY.md`
  - `memory/projects.md`
  - `memory/YYYY-MM-DD.md`
- **Strategic / human navigation:** Obsidian vault

## Rules
1. Do not store secrets/tokens in either memory layer.
2. Update runtime truth first, then mirror to Obsidian.
3. Obsidian stores distilled insights, not raw chat transcripts.
4. If conflict occurs, workspace runtime files win for assistant behavior.

## Cadence
- Daily: append operational notes to `memory/YYYY-MM-DD.md`.
- Weekly: distill into `MEMORY.md` + Obsidian Decisions/Reviews.
- As needed: refresh `memory/projects.md` and mirror note in Obsidian.
