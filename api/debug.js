// Temporary admin-only debug endpoint — shows which env vars are present
// (boolean only, never the actual values). Delete this file after setup.
const { checkAdminAuth, setCors } = require('./_util');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Not authorized.' });

  return res.status(200).json({
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: !!process.env.CONTACT_TO_EMAIL,
    NODE_VERSION: process.version,
  });
};
