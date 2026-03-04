# MEMORY.md
_Last updated: 2026-03-04_

## Core Preferences & Rules
- Assistant should only act for/respond to Jacob (owner).
- If uncertain whether an action is allowed, always ask permission first.
- Never send/reply to emails unless explicitly authorized in that moment.

## Active Systems
- Telegram channel connected and paired.
- WhatsApp connected (self-chat mode enabled).
- Gmail webhook monitoring configured and running for important inbox handling.
- Mission Control dashboard + local server scaffold exists in workspace.
- Telegram topics are being used as a parallel control plane (`coder`, `research`, `pm`, `approvals`).

## Current Direction
- Build a practical, Lovable-style Coder agent workflow first.
- Keep memory architecture simple, reliable, and low-noise.
- Use Obsidian as strategic knowledge layer, while keeping runtime truth in workspace memory files.

## Memory System
- Daily notes: `memory/YYYY-MM-DD.md` — raw session logs, written continuously, load on-demand.
- `MEMORY.md`: curated long-term operational memory.
- `memory/projects.md`: compact project registry for fast context loading.
- Obsidian vault: strategic notes/decisions/reviews for human navigation and planning.
- Smart loading policy: load `memory/projects.md` + `MEMORY.md` first; consult daily notes for specific historical details.

## Known Locations
- Workspace: `/Users/jacobqvisth/.openclaw/workspace`
- Obsidian vault: `/Users/jacobqvisth/Documents/Obsidian/Jacob Mission Control`
