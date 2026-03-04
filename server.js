const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = 8899;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'mc-data.json');
const ACTIVITY_FILE = path.join(ROOT, 'mc-activity.json');
const HTML_FILE = path.join(ROOT, 'mission-control.html');
const STARTED = Date.now();

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
function send(res, code, body, type='application/json') {
  res.writeHead(code, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => d += c);
    req.on('end', () => {
      try { resolve(d ? JSON.parse(d) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}
function getWeather(city) {
  return new Promise((resolve, reject) => {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    https.get(url, r => {
      let raw = '';
      r.on('data', c => raw += c);
      r.on('end', () => {
        try {
          const j = JSON.parse(raw);
          const cur = j.current_condition?.[0] || {};
          resolve({
            city,
            temperature: cur.temp_C || null,
            condition: cur.weatherDesc?.[0]?.value || null,
            feels_like: cur.FeelsLikeC || null
          });
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function getImportantEmails(account, max = 10) {
  return new Promise((resolve, reject) => {
    const query = 'in:inbox is:important';
    const args = ['gmail', 'search', '-a', account, query, '--json', '--max', String(max)];
    execFile('gog', args, { timeout: 20000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try {
        const parsed = JSON.parse(stdout);
        const threads = parsed.threads || [];
        resolve(threads.map(t => ({
          id: t.id,
          date: t.date,
          from: t.from,
          subject: t.subject,
          labels: t.labels || [],
          messageCount: t.messageCount || 1
        })));
      } catch (e) {
        reject(e);
      }
    });
  });
}

function parseSessionKey(key = '') {
  const parts = key.split(':');
  const out = { raw: key, surface: 'other', chatType: null, chatId: null, topicId: null };
  const telegramIndex = parts.indexOf('telegram');
  if (telegramIndex >= 0) {
    out.surface = 'telegram';
    out.chatType = parts[telegramIndex + 1] || null;
    out.chatId = parts[telegramIndex + 2] || null;
    const topicMarker = parts.indexOf('topic');
    if (topicMarker >= 0) out.topicId = parts[topicMarker + 1] || null;
  }
  return out;
}

function getSessions(activeMinutes = 1440) {
  return new Promise((resolve, reject) => {
    const args = ['sessions', '--json', '--active', String(activeMinutes), '--all-agents'];
    execFile('openclaw', args, { timeout: 20000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try {
        const parsed = JSON.parse(stdout);
        const sessions = (parsed.sessions || []).map(s => {
          const meta = parseSessionKey(s.key);
          return {
            key: s.key,
            updatedAt: s.updatedAt,
            ageMs: s.ageMs,
            kind: s.kind,
            model: s.model || null,
            totalTokens: s.totalTokens ?? null,
            agentId: s.agentId || null,
            ...meta
          };
        });
        resolve({
          count: sessions.length,
          activeMinutes,
          sessions
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

if (!fs.existsSync(DATA_FILE)) writeJson(DATA_FILE, {});
if (!fs.existsSync(ACTIVITY_FILE)) writeJson(ACTIVITY_FILE, []);

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  if (req.method === 'GET' && u.pathname === '/') {
    if (!fs.existsSync(HTML_FILE)) return send(res, 404, { error: 'mission-control.html not found' });
    return send(res, 200, fs.readFileSync(HTML_FILE, 'utf8'), 'text/html; charset=utf-8');
  }

  if (req.method === 'GET' && u.pathname === '/mc/status') {
    return send(res, 200, {
      uptimeSeconds: Math.floor((Date.now() - STARTED) / 1000),
      lastRefresh: new Date().toISOString(),
      health: 'online'
    });
  }

  if (req.method === 'GET' && u.pathname === '/mc/data') {
    return send(res, 200, readJson(DATA_FILE, {}));
  }

  if (req.method === 'POST' && u.pathname === '/mc/data') {
    try {
      const body = await parseBody(req);
      writeJson(DATA_FILE, body);
      return send(res, 200, { ok: true, savedAt: new Date().toISOString() });
    } catch {
      return send(res, 400, { ok: false, error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'GET' && u.pathname === '/mc/weather') {
    const city = u.searchParams.get('city') || 'Stockholm';
    try { return send(res, 200, await getWeather(city)); }
    catch { return send(res, 502, { error: 'Weather fetch failed' }); }
  }

  if (req.method === 'GET' && u.pathname === '/mc/emails') {
    const account = u.searchParams.get('account') || 'jacob.qvisth@gmail.com';
    const max = Number(u.searchParams.get('max') || 10);
    try {
      const emails = await getImportantEmails(account, max);
      const unread = emails.filter(e => (e.labels || []).includes('UNREAD')).length;
      return send(res, 200, {
        account,
        count: emails.length,
        unread,
        emails,
        fetchedAt: new Date().toISOString()
      });
    } catch (e) {
      return send(res, 502, { error: 'Email fetch failed', detail: e.message });
    }
  }

  if (req.method === 'GET' && u.pathname === '/mc/sessions') {
    const active = Number(u.searchParams.get('active') || 1440);
    try {
      return send(res, 200, await getSessions(active));
    } catch (e) {
      return send(res, 502, { error: 'Session fetch failed', detail: e.message });
    }
  }

  if (req.method === 'GET' && u.pathname === '/mc/activity') {
    const activity = readJson(ACTIVITY_FILE, []);
    return send(res, 200, activity.slice(-50).reverse());
  }

  if (req.method === 'POST' && u.pathname === '/mc/activity') {
    try {
      const body = await parseBody(req);
      const activity = readJson(ACTIVITY_FILE, []);
      activity.push({
        timestamp: new Date().toISOString(),
        description: body.description || 'No description',
        meta: body.meta || null
      });
      writeJson(ACTIVITY_FILE, activity.slice(-500));
      return send(res, 200, { ok: true });
    } catch {
      return send(res, 400, { ok: false, error: 'Invalid JSON body' });
    }
  }

  return send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Mission Control server running on http://localhost:${PORT}`);
});
