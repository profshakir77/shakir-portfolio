const { readJsonBody, kvRequest, checkAdminAuth, setCors } = require('./_util');
const { verifyJWT, getTokenFromReq } = require('./_auth');
function uid() { return `pr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const id = req.query.id;
  if (!id) {
    if (req.method === 'GET') {
      const isAdmin = checkAdminAuth(req);
      try {
        const ids = await kvRequest(['ZREVRANGE', 'projects', '0', '49']);
        if (!ids || !ids.length) return res.status(200).json({ projects: [] });
        const projects = await Promise.all(ids.map(async (pid) => {
          const f = await kvRequest(['HGETALL', `project:${pid}`]).catch(() => null);
          if (!f || !f.length) return null;
          const p = {};
          for (let i = 0; i < f.length; i += 2) p[f[i]] = f[i + 1];
          if (!isAdmin && p.status !== 'approved') return null;
          return { id: p.id, studentId: p.studentId, studentName: p.studentName, title: p.title, description: p.description, tech: p.tech ? p.tech.split(',') : [], githubUrl: p.githubUrl, liveUrl: p.liveUrl, imageUrl: p.imageUrl, status: p.status, createdAt: Number(p.createdAt) };
        }));
        return res.status(200).json({ projects: projects.filter(Boolean) });
      } catch (err) {
        if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ projects: [], warning: 'Storage not configured.' });
        return res.status(500).json({ error: 'Could not load projects.' });
      }
    }
    if (req.method === 'POST') {
      const token = getTokenFromReq(req);
      const user = verifyJWT(token);
      if (!user) return res.status(401).json({ error: 'You must be logged in to submit a project.' });
      const status = await kvRequest(['HGET', `student:${user.id}`, 'status']).catch(() => null);
      if (status !== 'approved') return res.status(403).json({ error: 'Your account is not approved yet.' });
      const body = await readJsonBody(req);
      const title = (body.title || '').trim().slice(0, 120);
      const description = (body.description || '').trim().slice(0, 800);
      const tech = (body.tech || '').trim().slice(0, 200);
      const githubUrl = (body.githubUrl || '').trim().slice(0, 300);
      const liveUrl = (body.liveUrl || '').trim().slice(0, 300);
      const imageUrl = (body.imageUrl || '').trim().slice(0, 500);
      if (!title) return res.status(400).json({ error: 'Project title is required.' });
      if (!description) return res.status(400).json({ error: 'Description is required.' });
      const pid = uid();
      const createdAt = Date.now();
      await kvRequest(['HSET', `project:${pid}`, 'id', pid, 'studentId', user.id, 'studentName', user.name, 'title', title, 'description', description, 'tech', tech, 'githubUrl', githubUrl, 'liveUrl', liveUrl, 'imageUrl', imageUrl, 'status', 'pending', 'createdAt', String(createdAt)]);
      await kvRequest(['ZADD', 'projects', String(createdAt), pid]);
      return res.status(201).json({ ok: true, message: 'Project submitted for review. It will appear publicly once approved.' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }
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
