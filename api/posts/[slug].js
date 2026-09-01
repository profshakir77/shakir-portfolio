// GET    /api/posts/:slug -> fetch a single post, public
// DELETE /api/posts/:slug -> remove a post, requires X-Admin-Password header

const { kvRequest, checkAdminAuth, setCors } = require('../_util');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing post slug.' });
  }

  if (req.method === 'GET') {
    try {
      const raw = await kvRequest(['get', `post:${slug}`]);
      if (!raw) return res.status(404).json({ error: 'Post not found.' });
      return res.status(200).json({ post: JSON.parse(raw) });
    } catch (err) {
      if (err.code === 'KV_NOT_CONFIGURED') {
        return res.status(404).json({ error: 'Post not found.' });
      }
      console.error('GET /api/posts/[slug] error:', err);
      return res.status(500).json({ error: 'Could not load that post right now.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Not authorized.' });
    }
    try {
      await kvRequest(['del', `post:${slug}`]);
      await kvRequest(['zrem', 'posts:index', slug]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/posts/[slug] error:', err);
      return res.status(500).json({ error: 'Could not delete that post right now.' });
    }
  }

  res.setHeader('Allow', 'GET, DELETE, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed.' });
};
