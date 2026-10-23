import { kvRequest, setCors } from '../../lib/_util';

// Public mentee team: approved students only. Never returns emails or other
// private fields, just what is safe to show on the mentorship page.
function toObj(f) {
  const o = {};
  for (let i = 0; i < f.length; i += 2) o[f[i]] = f[i + 1];
  return o;
}

export default async function handler(req, res) {
  setCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  try {
    const [sids, pids] = await Promise.all([
      kvRequest(['ZREVRANGE', 'students', '0', '199']),
      kvRequest(['ZREVRANGE', 'projects', '0', '199']),
    ]);
    // Count approved projects per student.
    const counts = {};
    await Promise.all((pids || []).map(async (pid) => {
      const f = await kvRequest(['HMGET', `project:${pid}`, 'studentId', 'status']).catch(() => null);
      if (f && f[1] === 'approved' && f[0]) counts[f[0]] = (counts[f[0]] || 0) + 1;
    }));
    const team = await Promise.all((sids || []).map(async (sid) => {
      const f = await kvRequest(['HGETALL', `student:${sid}`]).catch(() => null);
      if (!f || !f.length) return null;
      const s = toObj(f);
      if (s.status !== 'approved' || !s.name) return null;
      let github = (s.github || '').trim();
      if (github && !/^https?:\/\//i.test(github)) github = `https://github.com/${github.replace(/^@/, '')}`;
      if (github && !/^https:\/\/(www\.)?github\.com\//i.test(github)) github = '';
      let linkedin = (s.linkedin || '').trim();
      if (linkedin && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(linkedin)) linkedin = '';
      return {
        id: s.id,
        linkedin,
        name: s.name.slice(0, 80),
        bio: (s.bio || '').slice(0, 220),
        github,
        projects: counts[s.id] || 0,
        joined: Number(s.createdAt) || null,
      };
    }));
    const list = team.filter(Boolean).sort((a, b) => b.projects - a.projects || (a.joined || 0) - (b.joined || 0));
    return res.status(200).json({ team: list });
  } catch (err) {
    if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ team: [], warning: 'Storage not configured.' });
    return res.status(500).json({ error: 'Could not load team.' });
  }
}
