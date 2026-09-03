// GET  /api/posts           -> list all posts (newest first)
// POST /api/posts           -> create post (admin)
// GET  /api/posts/:slug     -> single post
// DELETE /api/posts/:slug   -> delete post (admin)
const { readJsonBody, kvRequest, slugify, estimateReadTime, checkAdminAuth, setCors, escapeHtml } = require('../_util');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // slug is undefined for /api/posts, 'my-post' for /api/posts/my-post
  const _p = req.query.slug || [];
  const slug = (_p.length && _p[0] !== '_') ? _p[0] : undefined;

  // ── collection (/api/posts) ──────────────────────────────────────────────
  if (!slug) {
    if (req.method === 'GET') {
      try {
        const slugs = await kvRequest(['zrevrange', 'posts:index', '0', '-1']);
        if (!slugs || !slugs.length) return res.status(200).json({ posts: [] });
        const raws = await Promise.all(slugs.map((s) => kvRequest(['get', `post:${s}`])));
        const posts = raws.map((raw) => { try { return raw ? JSON.parse(raw) : null; } catch { return null; } }).filter(Boolean);
        return res.status(200).json({ posts });
      } catch (err) {
        if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ posts: [], warning: 'Storage is not configured yet.' });
        return res.status(500).json({ error: 'Could not load posts right now.' });
      }
    }

    if (req.method === 'POST') {
      if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Not authorized.' });
      const body = await readJsonBody(req);
      const title = String(body.title || '').trim();
      const excerpt = String(body.excerpt || '').trim();
      const category = String(body.category || 'General').trim();
      const content = String(body.content || '').trim();
      const coverImage = String(body.coverImage || '').trim();
      if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });

      let s = slugify(body.slug || title);
      if (!s) return res.status(400).json({ error: 'Could not derive a URL slug from that title.' });

      try {
        const existing = await kvRequest(['get', `post:${s}`]);
        if (existing) s = `${s}-${Date.now().toString(36)}`;
        const now = Date.now();
        const post = {
          slug: s, title: escapeHtml(title), excerpt: escapeHtml(excerpt || content.slice(0, 160)),
          category: escapeHtml(category), content, coverImage, readTime: estimateReadTime(content), createdAt: now,
        };
        await kvRequest(['set', `post:${s}`, JSON.stringify(post)]);
        await kvRequest(['zadd', 'posts:index', String(now), s]);
        return res.status(201).json({ post });
      } catch (err) {
        if (err.code === 'KV_NOT_CONFIGURED') return res.status(500).json({ error: 'Storage is not configured yet.' });
        return res.status(500).json({ error: 'Could not save the post right now.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // ── single (/api/posts/:slug) ─────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const raw = await kvRequest(['get', `post:${slug}`]);
      if (!raw) return res.status(404).json({ error: 'Post not found.' });
      return res.status(200).json({ post: JSON.parse(raw) });
    } catch (err) {
      if (err.code === 'KV_NOT_CONFIGURED') return res.status(404).json({ error: 'Post not found.' });
      return res.status(500).json({ error: 'Could not load that post right now.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Not authorized.' });
    try {
      await kvRequest(['del', `post:${slug}`]);
      await kvRequest(['zrem', 'posts:index', slug]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Could not delete that post right now.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
};
