// JWT signing/verification and password hashing — zero npm deps.
// Uses Node's built-in `crypto` module only.
const crypto = require('crypto');

const JWT_SECRET = () => process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'change-me-in-prod';
const JWT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// --- JWT ------------------------------------------------------------------

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function signJWT(payload) {
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64url(Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + JWT_TTL_MS) / 1000),
  })));
  const sig = base64url(
    crypto.createHmac('sha256', JWT_SECRET()).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${sig}`;
}

function verifyJWT(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = base64url(
    crypto.createHmac('sha256', JWT_SECRET()).update(`${header}.${body}`).digest()
  );
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getTokenFromReq(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

// --- Password hashing (PBKDF2-SHA512, 100k iterations) --------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.startsWith('pbkdf2:')) return false;
  const [, salt, hash] = stored.split(':');
  try {
    const attempt = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

module.exports = { signJWT, verifyJWT, getTokenFromReq, hashPassword, verifyPassword };
