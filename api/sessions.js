module.exports = async (req, res) => {
  const bridgeUrl = process.env.MC_BRIDGE_URL;
  const bridgeToken = process.env.MC_BRIDGE_TOKEN;
  const active = Number(req.query?.active || 10080);

  if (!bridgeUrl || !bridgeToken) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      ok: false,
      error: 'Bridge not configured',
      detail: 'Set MC_BRIDGE_URL and MC_BRIDGE_TOKEN in Vercel env vars.'
    }));
    return;
  }

  try {
    const url = `${bridgeUrl.replace(/\/$/, '')}/mc/sessions-bridge?active=${active}`;
    const r = await fetch(url, {
      headers: {
        'x-mc-bridge-token': bridgeToken
      }
    });
    const text = await r.text();
    res.statusCode = r.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(text);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Bridge request failed', detail: e.message }));
  }
};
