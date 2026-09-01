// Small shared helpers for the API routes. No npm dependencies on purpose --
// every route talks to Resend and Vercel KV over plain HTTP (native fetch),
// so the project needs no build step and no package installs.

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Reads the JSON body Vercel already parsed, or parses it manually if the
// runtime handed us a raw string/stream (defensive -- Vercel's Node runtime
// normally does this for us when Content-Type is application/json).
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

// Vercel KV (Upstash Redis) REST API -- https://vercel.com/docs/storage/vercel-kv/kv-reference
// Requires KV_REST_API_URL and KV_REST_API_TOKEN, which Vercel injects
// automatically once a KV store is linked to the project. Commands are sent
// as a JSON array body (rather than URL path segments) so long values --
// a full blog post's JSON -- never risk hitting a URL length limit.
async function kvRequest(commandParts) {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!base || !token) {
    const err = new Error('KV_NOT_CONFIGURED');
    err.code = 'KV_NOT_CONFIGURED';
    throw err;
  }
  const res = await fetch(base, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commandParts),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`KV request failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(`KV command error: ${json.error}`);
  return json.result;
}

async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const err = new Error('RESEND_NOT_CONFIGURED');
    err.code = 'RESEND_NOT_CONFIGURED';
    throw err;
  }
  const from = process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Resend request failed (${res.status}): ${text}`);
  }
  return res.json();
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function estimateReadTime(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function checkAdminAuth(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = req.headers['x-admin-password'] || '';
  return header === expected;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
}

module.exports = {
  escapeHtml,
  isValidEmail,
  readJsonBody,
  kvRequest,
  sendEmail,
  slugify,
  estimateReadTime,
  checkAdminAuth,
  setCors,
};
