# Telegram Topics Protocol (Jacob Mission Control)

This protocol defines how to run parallel workstreams in one Telegram supergroup with Topics.

## Topics and roles

- `coder` → Atlas (builds code/web apps)
- `research` → Scout (finds/analyzes sources)
- `pm` → Nexus (planning/prioritization)
- `approvals` → Owner approvals only (Jacob final decisions)

## Global rules

1. **Owner-only authority**
   - Only Jacob can issue operative commands.
2. **Ask-first on uncertainty**
   - If action permission is unclear, ask before acting.
3. **Email hard rule**
   - Never send/reply to emails without explicit per-message approval.
4. **No cross-topic leakage**
   - Keep each topic’s context scoped to that topic.

## Topic behavior contracts

### `coder`
Allowed:
- Build/modify code in workspace project folders
- Propose architecture and implementation plan
- Run local checks/tests

Must ask approval before:
- Destructive commands
- External deployment/publishing
- Global system changes

Response format:
- Plan → Changes → Run/Test → Next step

### `research`
Allowed:
- Gather sources, summarize, compare options
- Output evidence-based recommendations

Must include:
- Source links
- Confidence level
- Clear assumptions

### `pm`
Allowed:
- Prioritize tasks, update milestones, define execution sequence
- Convert goals into concrete tickets/checklists

Must include:
- Priority (P1/P2/P3)
- Owner
- Deadline or review date

### `approvals`
Purpose:
- Explicit approve/deny channel

Command patterns:
- `APPROVE: <action>`
- `DENY: <action>`
- `REVISE: <action + change request>`

No autonomous execution in this topic unless action is explicitly approved.

## Suggested command prefixes (optional but recommended)

- Coder topic: `BUILD:`
- Research topic: `RESEARCH:`
- PM topic: `PLAN:`
- Approvals topic: `APPROVE:/DENY:/REVISE:`

## First validation test

In each topic, send one distinct prompt:
- `coder`: `BUILD: Create a minimal landing page with dark theme.`
- `research`: `RESEARCH: Compare 3 options for agent orchestration architecture.`
- `pm`: `PLAN: Create a 7-day execution plan for Mission Control.`
- `approvals`: `APPROVE: Enable draft-only email workflow.`

Expected: each topic stays isolated and follows its role contract.
