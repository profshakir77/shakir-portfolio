// POST /api/estimate -> capture a cost-calculator lead (services.html), store it
//                        in Vercel KV, and email Shakir a notification (plus an
//                        optional copy to the visitor if they asked for one)
// GET  /api/estimate  -> list captured estimates, requires X-Admin-Password
//
// Estimates are stored as an append-only Redis list (`estimates:log`) --
// there's no need to look one up by id, only to list them for the admin view.

const { readJsonBody, kvRequest, sendEmail, isValidEmail, escapeHtml, checkAdminAuth, setCors } = require('./_util');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Not authorized.' });
    }
    try {
      const raws = await kvRequest(['lrange', 'estimates:log', '0', '-1']);
      const estimates = (raws || [])
        .map((raw) => { try { return JSON.parse(raw); } catch { return null; } })
        .filter(Boolean)
        .reverse(); // newest first
      return res.status(200).json({ estimates });
    } catch (err) {
      if (err.code === 'KV_NOT_CONFIGURED') return res.status(200).json({ estimates: [] });
      console.error('GET /api/estimate error:', err);
      return res.status(500).json({ error: 'Could not load estimates right now.' });
    }
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const { projectType, pages, addons, estimateLow, estimateHigh, name, email, website } = body;

    // Honeypot field, same pattern as the contact form.
    if (website) return res.status(200).json({ ok: true });

    if (!projectType) {
      return res.status(400).json({ error: 'Missing project type.' });
    }
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const record = {
      projectType: String(projectType),
      pages: Number(pages) || null,
      addons: Array.isArray(addons) ? addons.map(String) : [],
      estimateLow: Number(estimateLow) || null,
      estimateHigh: Number(estimateHigh) || null,
      name: name ? String(name).trim() : null,
      email: email ? String(email).trim() : null,
      createdAt: Date.now(),
    };

    try {
      await kvRequest(['rpush', 'estimates:log', JSON.stringify(record)]);
    } catch (err) {
      if (err.code !== 'KV_NOT_CONFIGURED') console.error('Could not store estimate:', err);
      // Storage being unavailable shouldn't block the visitor's experience --
      // fall through and still try to send the notification email.
    }

    const to = process.env.CONTACT_TO_EMAIL || 'mr.shakir77@gmail.com';
    const range = record.estimateLow && record.estimateHigh
      ? `$${record.estimateLow}-$${record.estimateHigh}`
      : 'n/a';
    const leadHtml = `
      <h2>New cost calculator estimate</h2>
      <p><strong>Project type:</strong> ${escapeHtml(record.projectType)}</p>
      <p><strong>Pages/screens:</strong> ${record.pages || 'n/a'}</p>
      <p><strong>Add-ons:</strong> ${record.addons.length ? escapeHtml(record.addons.join(', ')) : 'none'}</p>
      <p><strong>Estimated range shown:</strong> ${escapeHtml(range)}</p>
      ${record.name ? `<p><strong>Name:</strong> ${escapeHtml(record.name)}</p>` : ''}
      ${record.email ? `<p><strong>Email:</strong> ${escapeHtml(record.email)}</p>` : '<p>No contact info provided (visitor did not ask for a copy).</p>'}
    `.trim();

    try {
      await sendEmail({
        to,
        replyTo: record.email || undefined,
        subject: `New estimate request${record.name ? ' from ' + record.name : ''}`,
        html: leadHtml,
      });
    } catch (err) {
      if (err.code !== 'RESEND_NOT_CONFIGURED') console.error('Could not email lead notification:', err);
      // Same reasoning: don't fail the visitor's request over email delivery.
    }

    if (record.email) {
      const copyHtml = `
        <h2>Your project estimate</h2>
        <p>Thanks for using the cost calculator on shakir-portfolio-azure.vercel.app -- here's a copy of what you selected:</p>
        <p><strong>Project type:</strong> ${escapeHtml(record.projectType)}</p>
        <p><strong>Pages/screens:</strong> ${record.pages || 'n/a'}</p>
        <p><strong>Add-ons:</strong> ${record.addons.length ? escapeHtml(record.addons.join(', ')) : 'none'}</p>
        <p><strong>Estimated range:</strong> ${escapeHtml(range)}</p>
        <p>This is a ballpark figure -- reply to this email or use the contact form for a firm quote.</p>
      `.trim();
      try {
        await sendEmail({
          to: record.email,
          subject: 'Your website project estimate',
          html: copyHtml,
        });
      } catch (err) {
        console.error('Could not email estimate copy to visitor:', err);
      }
    }

    return res.status(201).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed.' });
};
