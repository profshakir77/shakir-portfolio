// Single handler for all auth routes:
//   POST /api/auth/register  -> create pending student account
//   POST /api/auth/login     -> verify credentials, return JWT
//   GET  /api/auth/me        -> return current student from JWT
const { readJsonBody, kvRequest, isValidEmail, setCors } = require('../_util');
const { verifyPassword, signJWT, hashPassword, verifyJWT, getTokenFromReq } = require('../_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action;

  // ── register ─────────────────────────────────────────────────────────────
  if (action === 'register') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const body = await readJsonBody(req);
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const bio = (body.bio || '').trim().slice(0, 400);
    const github = (body.github || '').trim().slice(0, 200);
    const linkedin = (body.linkedin || '').trim().slice(0, 200);

    if (!name || name.length < 2) return res.status(400).json({ error: 'Name is required (min 2 chars).' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'A valid email is required.' });
    if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const existing = await kvRequest(['GET', `student:email:${email}`]).catch(() => null);
    if (existing) return res.status(409).json({ error: 'An account with that email already exists.' });

    const id = `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = Date.now();
    const passwordHash = hashPassword(password);

    await kvRequest(['HSET', `student:${id}`,
      'id', id, 'name', name, 'email', email, 'passwordHash', passwordHash,
      'bio', bio, 'github', github, 'linkedin', linkedin,
      'status', 'pending', 'createdAt', String(createdAt),
    ]);
    await kvRequest(['SET', `student:email:${email}`, id]);
    await kvRequest(['ZADD', 'students', String(createdAt), id]);

    return res.status(201).json({ ok: true, message: 'Registration submitted. You will be notified when your account is approved.' });
  }

  // ── login ─────────────────────────────────────────────────────────────────
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const body = await readJsonBody(req);
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const studentId = await kvRequest(['GET', `student:email:${email}`]).catch(() => null);
    if (!studentId) return res.status(401).json({ error: 'Invalid email or password.' });

    const fields = await kvRequest(['HGETALL', `student:${studentId}`]).catch(() => null);
    if (!fields || !fields.length) return res.status(401).json({ error: 'Invalid email or password.' });

    const student = {};
    for (let i = 0; i < fields.length; i += 2) student[fields[i]] = fields[i + 1];

    if (student.status !== 'approved') {
      const msg = student.status === 'pending'
        ? 'Your account is pending approval. Please check back soon.'
        : 'Your account has been rejected. Contact the admin for more info.';
      return res.status(403).json({ error: msg });
    }

    if (!verifyPassword(password, student.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signJWT({ id: student.id, email: student.email, name: student.name });
    return res.status(200).json({
      ok: true, token,
      student: { id: student.id, name: student.name, email: student.email, bio: student.bio, github: student.github },
    });
  }

  // ── me ────────────────────────────────────────────────────────────────────
  if (action === 'me') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const token = getTokenFromReq(req);
    const payload = verifyJWT(token);
    if (!payload) return res.status(401).json({ error: 'Not authenticated.' });

    const fields = await kvRequest(['HGETALL', `student:${payload.id}`]).catch(() => null);
    if (!fields || !fields.length) return res.status(404).json({ error: 'Account not found.' });

    const student = {};
    for (let i = 0; i < fields.length; i += 2) student[fields[i]] = fields[i + 1];

    return res.status(200).json({
      student: { id: student.id, name: student.name, email: student.email, bio: student.bio, github: student.github, linkedin: student.linkedin, status: student.status },
    });
  }

  return res.status(404).json({ error: 'Not found.' });
};
