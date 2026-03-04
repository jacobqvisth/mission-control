# Projects Registry
_Last updated: 2026-03-04_

## 1) Jacob Mission Control
- **Status:** in progress
- **What:** Personal command center (dashboard + command center + project tracking + inbox visibility)
- **Live URL:** local only (`http://localhost:8899`)
- **Stack:** Single-file HTML/CSS/JS + Node.js local server
- **Key files:**
  - `/Users/jacobqvisth/.openclaw/workspace/mission-control.html`
  - `/Users/jacobqvisth/.openclaw/workspace/server.js`
  - `/Users/jacobqvisth/.openclaw/workspace/MISSION_CONTROL_SETUP.md`
- **Blockers / notes:** Command Center agents are currently mostly UI/logical; real sub-agent wiring is next.

## 2) Telegram Topic Control Plane
- **Status:** live
- **What:** Multi-topic parallel workstreams in Telegram (`coder`, `research`, `pm`, `approvals`)
- **Live URL:** n/a (Telegram topics)
- **Stack:** OpenClaw Telegram channel + topic/session isolation + protocol docs
- **Key files:**
  - `/Users/jacobqvisth/.openclaw/workspace/TELEGRAM_TOPIC_PROTOCOL.md`
- **Blockers / notes:** Resolved polling conflict by cleaning duplicate OpenClaw processes.

## 3) Gmail Important-Email Monitoring
- **Status:** live
- **What:** Important inbox monitoring + alerts workflow (no auto-send)
- **Live URL:** n/a
- **Stack:** OpenClaw webhooks + gog + GCP Pub/Sub + Tailscale Funnel
- **Key files:**
  - `~/.openclaw/openclaw.json` (hooks.gmail config)
- **Blockers / notes:** Hard rule stays: never send/reply emails without explicit approval.

## 4) Obsidian Knowledge System
- **Status:** in progress
- **What:** Structured personal knowledge vault linked to Mission Control
- **Live URL:** local vault
- **Stack:** Obsidian local Markdown vault
- **Key files/folders:**
  - `/Users/jacobqvisth/Documents/Obsidian/Jacob Mission Control/`
- **Blockers / notes:** Need lightweight sync routine between workspace memory and Obsidian strategic notes.
