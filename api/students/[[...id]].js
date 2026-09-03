// GET  /api/students          -> list all students (admin only)
// PATCH /api/students/:id     -> approve/reject (admin)
// DELETE /api/students/:id    -> delete student (admin)
const { readJsonBody, kvRequest, checkAdminAuth, setCors } = require('../_util');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const _p = req.query.id || [];
  const id = (_p.length && _p[0] !== '_') ? _p[0] : undefined;

  // ── collection (/api/students) ────────────────────────────────────────────
  if (!id) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const ids = await kvRequest(['ZREVRANGE', 'students', '0', '99']);
      if (!ids || !ids.length) return res.status(200).json({ students: [] });
      const students = await Promise.all(ids.map(async (sid) => {
        const fields = await kvRequest(['HGETALL', `student:${sid}`]).catch(() => null);
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
  }

  // ── single (/api/students/:id) ────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const body = await readJsonBody(req);
    const action = body.action;
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'action must be approve or reject.' });
    const status = action === 'approve' ? 'approved' : 'rejected';
    await kvRequest(['HSET', `student:${id}`, 'status', status]);
    return res.status(200).json({ ok: true, status });
  }

  if (req.method === 'DELETE') {
    const email = await kvRequest(['HGET', `student:${id}`, 'email']).catch(() => null);
    await kvRequest(['DEL', `student:${id}`]);
    if (email) await kvRequest(['DEL', `student:email:${email}`]);
    await kvRequest(['ZREM', 'students', id]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
