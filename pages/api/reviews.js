import { readJsonBody, kvRequest, checkAdminAuth, setCors } from '../../lib/_util';
export default async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const id = req.query.id;
  if (!id) {
    if (req.method === 'GET') {
      const isAdmin = checkAdminAuth(req);
      try {
        const ids = await kvRequest(['ZREVRANGE', 'reviews', '0', '49']);
        if (!ids || !ids.length) return res.status(200).json({ reviews: [] });
        const reviews = await Promise.all(ids.map(async (rid) => {
          const f = await kvRequest(['HGETALL', `review:${rid}`]).catch(() => null);
          if (!f || !f.length) return null;
          const r = {};
          for (let i = 0; i < f.length; i += 2) r[f[i]] = f[i + 1];
          if (!isAdmin && r.status !== 'approved') return null;
          return { id: r.id, name: r.name, role: r.role, rating: Number(r.rating), content: r.content, photo: r.photo || '', project: r.project || '', status: r.status, createdAt: Number(r.createdAt) };
        }));
        return res.status(200).json({ reviews: reviews.filter(Boolean) });
      } catch (err) {
        if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ reviews: [], warning: 'Storage not configured.' });
        return res.status(500).json({ error: 'Could not load reviews.' });
      }
    }
    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const name = (body.name || '').trim().slice(0, 80);
      const role = (body.role || '').trim().slice(0, 80);
      const rating = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5));
      const content = (body.content || '').trim().slice(0, 1000);
      // Optional reviewer photo: a small JPEG/PNG/WebP data URL resized in the
      // browser (about 10 KB). Anything else is dropped.
      let photo = typeof body.photo === 'string' ? body.photo : '';
      if (photo && (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo) || photo.length > 80000)) photo = '';
      // Optional link to the project or business website.
      let project = (body.project || '').trim().slice(0, 200);
      if (project && !/^https?:\/\//i.test(project)) project = `https://${project}`;
      if (project && !/^https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(project)) project = '';
      if (!name || name.length < 2) return res.status(400).json({ error: 'Your name is required.' });
      if (!content || content.length < 20) return res.status(400).json({ error: 'Review must be at least 20 characters.' });
      const rid = `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const createdAt = Date.now();
      await kvRequest(['HSET', `review:${rid}`, 'id', rid, 'name', name, 'role', role, 'rating', String(rating), 'content', content, 'photo', photo, 'project', project, 'status', 'pending', 'createdAt', String(createdAt)]);
      await kvRequest(['ZADD', 'reviews', String(createdAt), rid]);
      return res.status(201).json({ ok: true, message: 'Thank you! Your review will appear after approval.' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method === 'PATCH') {
    const body = await readJsonBody(req);
    const action = body.action;
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'action must be approve or reject.' });
    await kvRequest(['HSET', `review:${id}`, 'status', action === 'approve' ? 'approved' : 'rejected']);
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await kvRequest(['DEL', `review:${id}`]);
    await kvRequest(['ZREM', 'reviews', id]);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
