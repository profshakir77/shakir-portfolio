// POST /api/auth/login
// Returns a signed JWT on success. Only approved students can log in.
const { readJsonBody, kvRequest, setCors } = require('../_util');
const { verifyPassword, signJWT } = require('../_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = await readJsonBody(req);
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const studentId = await kvRequest(['GET', `student:email:${email}`]).catch(() => null);
  if (!studentId) return res.status(401).json({ error: 'Invalid email or password.' });

  const fields = await kvRequest(['HGETALL', `student:${studentId}`]).catch(() => null);
  if (!fields || !fields.length) return res.status(401).json({ error: 'Invalid email or password.' });

  // HGETALL returns a flat array: [key, value, key, value, ...]
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
    ok: true,
    token,
    student: { id: student.id, name: student.name, email: student.email, bio: student.bio, github: student.github },
  });
};
