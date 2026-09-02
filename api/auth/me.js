// GET /api/auth/me
// Returns the current student's profile from their JWT.
const { kvRequest, setCors } = require('../_util');
const { verifyJWT, getTokenFromReq } = require('../_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = getTokenFromReq(req);
  const payload = verifyJWT(token);
  if (!payload) return res.status(401).json({ error: 'Not authenticated.' });

  const fields = await kvRequest(['HGETALL', `student:${payload.id}`]).catch(() => null);
  if (!fields || !fields.length) return res.status(404).json({ error: 'Account not found.' });

  const student = {};
  for (let i = 0; i < fields.length; i += 2) student[fields[i]] = fields[i + 1];

  return res.status(200).json({
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      bio: student.bio,
      github: student.github,
      linkedin: student.linkedin,
      status: student.status,
    },
  });
};
