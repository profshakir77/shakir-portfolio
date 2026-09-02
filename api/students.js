// GET /api/students  — Admin: list all students with status
const { kvRequest, checkAdminAuth, setCors } = require('./_util');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const ids = await kvRequest(['ZREVRANGE', 'students', '0', '99']);
    if (!ids || !ids.length) return res.status(200).json({ students: [] });

    const students = await Promise.all(ids.map(async (id) => {
      const fields = await kvRequest(['HGETALL', `student:${id}`]).catch(() => null);
      if (!fields || !fields.length) return null;
      const s = {};
      for (let i = 0; i < fields.length; i += 2) s[fields[i]] = fields[i + 1];
      return { id: s.id, name: s.name, email: s.email, bio: s.bio, github: s.github, status: s.status, createdAt: Number(s.createdAt) };
    }));

    return res.status(200).json({ students: students.filter(Boolean) });
  } catch (err) {
    if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ students: [], warning: 'Storage not configured.' });
    return res.status(500).json({ error: 'Could not load students.' });
  }
};
