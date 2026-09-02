// POST /api/auth/register
// Creates a pending student account. Admin must approve before login works.
const { readJsonBody, kvRequest, isValidEmail, setCors } = require('../_util');
const { hashPassword } = require('../_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
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

  // Check if email already registered
  const existing = await kvRequest(['GET', `student:email:${email}`]).catch(() => null);
  if (existing) return res.status(409).json({ error: 'An account with that email already exists.' });

  const id = `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = Date.now();
  const passwordHash = hashPassword(password);

  const student = { id, name, email, passwordHash, bio, github, linkedin, status: 'pending', createdAt };

  // Store student hash + email lookup + sorted set
  await kvRequest(['HSET', `student:${id}`,
    'id', id,
    'name', name,
    'email', email,
    'passwordHash', passwordHash,
    'bio', bio,
    'github', github,
    'linkedin', linkedin,
    'status', 'pending',
    'createdAt', String(createdAt),
  ]);
  await kvRequest(['SET', `student:email:${email}`, id]);
  await kvRequest(['ZADD', 'students', String(createdAt), id]);

  return res.status(201).json({
    ok: true,
    message: 'Registration submitted. You will be notified when your account is approved.',
  });
};
