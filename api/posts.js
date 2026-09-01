// GET  /api/posts        -> list all CMS-created posts (newest first), public
// POST /api/posts        -> create a new post, requires X-Admin-Password header
//
// Posts are stored in Vercel KV (Redis): each post as a JSON string under
// `post:<slug>`, with a sorted set `posts:index` (score = createdAt epoch ms)
// used to list them in order without scanning every key.
//
// Required env vars: KV_REST_API_URL, KV_REST_API_TOKEN (auto-set once a KV
// store is linked to the Vercel project), ADMIN_PASSWORD (for writes).

const { readJsonBody, kvRequest, slugify, estimateReadTime, checkAdminAuth, setCors, escapeHtml } = require('./_util');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const slugs = await kvRequest(['zrevrange', 'posts:index', '0', '-1']);
      if (!slugs || slugs.length === 0) return res.status(200).json({ posts: [] });

      const raws = await Promise.all(slugs.map((slug) => kvRequest(['get', `post:${slug}`])));
      const posts = raws
        .map((raw) => { try { return raw ? JSON.parse(raw) : null; } catch { return null; } })
        .filter(Boolean);
      return res.status(200).json({ posts });
    } catch (err) {
      if (err.code === 'KV_NOT_CONFIGURED') {
        return res.status(200).json({ posts: [], warning: 'Storage is not configured yet.' });
      }
      console.error('GET /api/posts error:', err);
      return res.status(500).json({ error: 'Could not load posts right now.' });
    }
  }

  if (req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    const body = await readJsonBody(req);
    const title = String(body.title || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const category = String(body.category || 'General').trim();
    const content = String(body.content || '').trim();
    const coverImage = String(body.coverImage || '').trim();

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    let slug = slugify(body.slug || title);
    if (!slug) {
      return res.status(400).json({ error: 'Could not derive a URL slug from that title.' });
    }

    try {
      const existing = await kvRequest(['get', `post:${slug}`]);
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const now = Date.now();
      const post = {
        slug,
        title: escapeHtml(title),
        excerpt: escapeHtml(excerpt || content.slice(0, 160)),
        category: escapeHtml(category),
        content, // stored as plain text/paragraphs; escaped at render time
        coverImage,
        readTime: estimateReadTime(content),
        createdAt: now,
      };

      await kvRequest(['set', `post:${slug}`, JSON.stringify(post)]);
      await kvRequest(['zadd', 'posts:index', String(now), slug]);

      return res.status(201).json({ post });
    } catch (err) {
      if (err.code === 'KV_NOT_CONFIGURED') {
        return res.status(500).json({ error: 'Storage is not configured yet -- see setup instructions.' });
      }
      console.error('POST /api/posts error:', err);
      return res.status(500).json({ error: 'Could not save the post right now.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed.' });
};
