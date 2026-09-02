// PATCH /api/reviews/:id { action: 'approve'|'reject' } — Admin
// DELETE /api/reviews/:id — Admin
const { readJsonBody, kvRequest, checkAdminAuth, setCors } = require('../_util');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Review ID required.' });

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
};
