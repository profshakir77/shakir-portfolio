// PATCH /api/students/:id  { action: 'approve' | 'reject' }
// DELETE /api/students/:id  — Admin only
const { readJsonBody, kvRequest, checkAdminAuth, setCors } = require('../_util');

module.exports = async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Student ID required.' });

  if (req.method === 'PATCH') {
    const body = await readJsonBody(req);
    const action = body.action; // 'approve' | 'reject'
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'action must be approve or reject.' });
    const status = action === 'approve' ? 'approved' : 'rejected';
    await kvRequest(['HSET', `student:${id}`, 'status', status]);
    return res.status(200).json({ ok: true, status });
  }

  if (req.method === 'DELETE') {
    // Look up email to remove the reverse-lookup key
    const email = await kvRequest(['HGET', `student:${id}`, 'email']).catch(() => null);
    await kvRequest(['DEL', `student:${id}`]);
    if (email) await kvRequest(['DEL', `student:email:${email}`]);
    await kvRequest(['ZREM', 'students', id]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
