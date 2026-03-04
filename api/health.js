function bool(v) {
  return !!v && String(v).trim().length > 0;
}

module.exports = (req, res) => {
  const required = [
    'MISSION_CONTROL_ENV',
    'MISSION_CONTROL_BASE_URL',
    'MC_API_KEY',
    'MC_WEBHOOK_SECRET',
    'OPENCLAW_GATEWAY_URL',
    'OPENCLAW_GATEWAY_TOKEN',
    'OPENCLAW_ACCOUNT_ID'
  ];

  const optional = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'LOG_LEVEL',
    'SENTRY_DSN'
  ];

  const missingRequired = required.filter((k) => !bool(process.env[k]));
  const missingOptional = optional.filter((k) => !bool(process.env[k]));

  const payload = {
    ok: missingRequired.length === 0,
    service: 'mission-control',
    timestamp: new Date().toISOString(),
    env: process.env.MISSION_CONTROL_ENV || 'unknown',
    checks: {
      required: {
        total: required.length,
        missing: missingRequired
      },
      optional: {
        total: optional.length,
        missing: missingOptional
      }
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = payload.ok ? 200 : 503;
  res.end(JSON.stringify(payload, null, 2));
};
