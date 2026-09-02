// GET /api/projects/:id — single project (any status, for admin)
// PATCH /api/projects/:id { action: 'approve'|'reject' } — Admin
// DELETE /api/projects/:id — Admin or owner
const { readJsonBody, kvRequest, checkAdminAuth, setCors } = require('../_util');
const { verifyJWT, getTokenFromReq } = require('../_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Project ID required.' });

  if (req.method === 'GET') {
    const f = await kvRequest(['HGETALL', `project:${id}`]).catch(() => null);
    if (!f || !f.length) return res.status(404).json({ error: 'Project not found.' });
    const p = {};
    for (let i = 0; i < f.length; i += 2) p[f[i]] = f[i + 1];
    return res.status(200).json({ project: { ...p, tech: p.tech ? p.tech.split(',') : [], createdAt: Number(p.createdAt) } });
  }

  const isAdmin = checkAdminAuth(req);

  if (req.method === 'PATCH') {
    if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });
    const body = await readJsonBody(req);
    const action = body.action;
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'action must be approve or reject.' });
    await kvRequest(['HSET', `project:${id}`, 'status', action === 'approve' ? 'approved' : 'rejected']);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const token = getTokenFromReq(req);
    const user = verifyJWT(token);
    if (!isAdmin && !user) return res.status(401).json({ error: 'Unauthorized' });
    if (!isAdmin && user) {
      const ownerId = await kvRequest(['HGET', `project:${id}`, 'studentId']).catch(() => null);
      if (ownerId !== user.id) return res.status(403).json({ error: 'You can only delete your own projects.' });
    }
    await kvRequest(['DEL', `project:${id}`]);
    await kvRequest(['ZREM', 'projects', id]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
