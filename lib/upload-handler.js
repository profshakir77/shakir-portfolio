// POST /api/upload — Authenticated students: upload a project image.
// Uses Vercel Blob (requires BLOB_READ_WRITE_TOKEN env var — set up a
// Blob store in the Vercel dashboard under Storage and connect it).
// Accepts multipart/form-data with a single field "file" (image only, max 5 MB).
const { setCors, checkAdminAuth } = require('./_util');
const { verifyJWT, getTokenFromReq } = require('./_auth');

// Parse multipart/form-data without npm using a simple boundary parser.
async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    if (!boundaryMatch) return reject(new Error('Not multipart'));
    const boundary = boundaryMatch[1];

    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('error', reject);
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const sep = Buffer.from(`--${boundary}`);
      const parts = [];
      let start = 0;
      while (start < buf.length) {
        const idx = buf.indexOf(sep, start);
        if (idx === -1) break;
        const end = buf.indexOf(sep, idx + sep.length);
        const slice = buf.slice(idx + sep.length, end === -1 ? buf.length : end);
        // Find the blank line separating headers from body
        const headerEnd = slice.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd === -1) { start = idx + sep.length; continue; }
        const rawHeaders = slice.slice(0, headerEnd).toString();
        const body = slice.slice(headerEnd + 4, slice.length - 2); // strip trailing \r\n
        const headers = {};
        rawHeaders.split('\r\n').filter(Boolean).forEach((l) => {
          const [k, ...v] = l.split(':'); headers[k.trim().toLowerCase()] = v.join(':').trim();
        });
        const dispMatch = (headers['content-disposition'] || '').match(/name="([^"]+)"/);
        const filenameMatch = (headers['content-disposition'] || '').match(/filename="([^"]+)"/);
        if (dispMatch) parts.push({ name: dispMatch[1], filename: filenameMatch ? filenameMatch[1] : null, type: headers['content-type'] || 'application/octet-stream', body });
        start = idx + sep.length;
      }
      resolve(parts);
    });
  });
}

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth: must be a logged-in student OR admin
  const token = getTokenFromReq(req);
  const user = verifyJWT(token);
  if (!user && !checkAdminAuth(req)) return res.status(401).json({ error: 'You must be logged in.' });

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return res.status(503).json({
      error: 'File uploads are not configured yet. Ask the admin to set up Vercel Blob storage.',
    });
  }

  let parts;
  try {
    parts = await parseMultipart(req);
  } catch {
    return res.status(400).json({ error: 'Invalid multipart request.' });
  }

  const filePart = parts.find((p) => p.name === 'file' && p.filename);
  if (!filePart) return res.status(400).json({ error: 'No file found in request. Use field name "file".' });

  // Size check (5 MB max)
  if (filePart.body.length > 5 * 1024 * 1024) {
    return res.status(413).json({ error: 'File is too large. Maximum size is 5 MB.' });
  }

  // Type check — images only
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(filePart.type)) {
    return res.status(415).json({ error: 'Only JPEG, PNG, GIF, and WebP images are allowed.' });
  }

  const ext = filePart.type.split('/')[1] || 'jpg';
  const blobName = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Upload to Vercel Blob REST API
  const blobRes = await fetch(`https://blob.vercel-storage.com/${blobName}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${blobToken}`,
      'Content-Type': filePart.type,
      'x-api-version': '7',
    },
    body: filePart.body,
  });

  if (!blobRes.ok) {
    const txt = await blobRes.text().catch(() => '');
    return res.status(502).json({ error: `Blob upload failed: ${txt.slice(0, 200)}` });
  }

  const blobData = await blobRes.json();
  return res.status(200).json({ ok: true, url: blobData.url });
};
