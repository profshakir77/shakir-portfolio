// GET /api/reviews  — Public: returns approved reviews
// POST /api/reviews — Anyone: submit a review (pending admin approval)
const { readJsonBody, kvRequest, isValidEmail, setCors } = require('./_util');

function uid() {
  return `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const adminPw = (req.headers['x-admin-password'] || '').trim();
    const isAdmin = adminPw && adminPw === (process.env.ADMIN_PASSWORD || '');
    try {
      const ids = await kvRequest(['ZREVRANGE', 'reviews', '0', '49']);
      if (!ids || !ids.length) return res.status(200).json({ reviews: [] });
      const reviews = await Promise.all(ids.map(async (id) => {
        const f = await kvRequest(['HGETALL', `review:${id}`]).catch(() => null);
        if (!f || !f.length) return null;
        const r = {};
        for (let i = 0; i < f.length; i += 2) r[f[i]] = f[i + 1];
        if (!isAdmin && r.status !== 'approved') return null;
        return { id: r.id, name: r.name, role: r.role, rating: Number(r.rating), content: r.content, status: r.status, createdAt: Number(r.createdAt) };
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
    const role = (body.role || '').trim().slice(0, 80); // e.g. "Owner, ABC Store"
    const rating = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5));
    const content = (body.content || '').trim().slice(0, 1000);

    if (!name || name.length < 2) return res.status(400).json({ error: 'Your name is required.' });
    if (!content || content.length < 20) return res.status(400).json({ error: 'Review must be at least 20 characters.' });

    const id = uid();
    const createdAt = Date.now();

    await kvRequest(['HSET', `review:${id}`,
      'id', id, 'name', name, 'role', role, 'rating', String(rating),
      'content', content, 'status', 'pending', 'createdAt', String(createdAt),
    ]);
    await kvRequest(['ZADD', 'reviews', String(createdAt), id]);

    return res.status(201).json({ ok: true, message: 'Thank you! Your review will appear after approval.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
