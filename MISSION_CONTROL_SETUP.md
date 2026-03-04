# Jacob Mission Control — Setup

## Files created

- `mission-control.html` — standalone dashboard (dark glassmorphism theme + localStorage)
- `server.js` — lightweight local API server (`localhost:8899`)
- `com.missioncontrol.server.plist` — LaunchAgent for auto-start on login

## 1) Run dashboard standalone (no server)

Open `mission-control.html` in your browser.

## 2) Run with local server (recommended)

```bash
cd /Users/jacobqvisth/.openclaw/workspace
node server.js
```

Open: http://localhost:8899

## 3) API endpoints

- `GET /mc/status`
- `GET /mc/data`
- `POST /mc/data`
- `GET /mc/weather?city=Stockholm`
- `GET /mc/emails?account=jacob.qvisth@gmail.com&max=12`
- `GET /mc/activity`
- `POST /mc/activity`

## 4) Optional auto-start on macOS login

```bash
cp /Users/jacobqvisth/.openclaw/workspace/com.missioncontrol.server.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/com.missioncontrol.server.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.missioncontrol.server.plist
launchctl list | grep missioncontrol
```

Stop it:

```bash
launchctl unload ~/Library/LaunchAgents/com.missioncontrol.server.plist
```

## 5) Vercel production setup

1. Open your Vercel project → **Settings → Environment Variables**.
2. Add variables from `.env.example`.
3. Deploy (or redeploy) after saving env vars.
4. Validate configuration at:

- `https://<your-domain>/api/health`

Expected:
- `200 OK` when all required vars are present.
- `503` with a list of missing required vars when setup is incomplete.

## 6) Next upgrade ideas

- Add Revenue module tab
- Add AI Agent Command Center tab
- Add Meetings and Intel tabs
- Add server sync from dashboard every 5 minutes
- Add weather/status in header from `/mc/status` + `/mc/weather`
