// GET /api/comments/:slug  — Public: all comments for a blog post
// POST /api/comments/:slug — Anyone: add a comment
const { readJsonBody, kvRequest, setCors } = require('../_util');

function uid() {
  return `cm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Slug required.' });

  const key = `comments:${slug}`;

  if (req.method === 'GET') {
    try {
      const ids = await kvRequest(['ZRANGE', key, '0', '99']).catch(() => []);
      if (!ids || !ids.length) return res.status(200).json({ comments: [] });
      const comments = await Promise.all(ids.map(async (id) => {
        const f = await kvRequest(['HGETALL', `comment:${id}`]).catch(() => null);
        if (!f || !f.length) return null;
        const c = {};
        for (let i = 0; i < f.length; i += 2) c[f[i]] = f[i + 1];
        return { id: c.id, name: c.name, content: c.content, createdAt: Number(c.createdAt) };
      }));
      return res.status(200).json({ comments: comments.filter(Boolean) });
    } catch {
      return res.status(200).json({ comments: [] });
    }
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const name = (body.name || '').trim().slice(0, 80);
    const content = (body.content || '').trim().slice(0, 1000);

    if (!name || name.length < 2) return res.status(400).json({ error: 'Name is required.' });
    if (!content || content.length < 3) return res.status(400).json({ error: 'Comment cannot be empty.' });

    const id = uid();
    const createdAt = Date.now();

    await kvRequest(['HSET', `comment:${id}`,
      'id', id, 'name', name, 'content', content, 'createdAt', String(createdAt),
    ]);
    await kvRequest(['ZADD', key, String(createdAt), id]);

    return res.status(201).json({ ok: true, comment: { id, name, content, createdAt } });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
