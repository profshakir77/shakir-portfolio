// POST /api/contact
// Replaces the old Formspree integration. Validates the contact form
// submission and emails it to Shakir via Resend.
//
// Required env vars (set in the Vercel project's Settings -> Environment
// Variables): RESEND_API_KEY. Optional: CONTACT_TO_EMAIL, RESEND_FROM_EMAIL.

const { escapeHtml, isValidEmail, readJsonBody, sendEmail, setCors } = require('./_util');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = await readJsonBody(req);
  const { name, email, budget, message, website } = body;

  // Honeypot: a real visitor never fills in this hidden field. Bots often
  // fill every input, so a non-empty value means silently drop the spam.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Please describe your project.' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'mr.shakir77@gmail.com';
  const html = `
    <h2>New message from the portfolio contact form</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${budget ? `<p><strong>Budget range:</strong> ${escapeHtml(budget)}</p>` : ''}
    <p><strong>Project brief:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `.trim();

  try {
    await sendEmail({
      to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err.code === 'RESEND_NOT_CONFIGURED') {
      console.error('RESEND_API_KEY is not set.');
      return res.status(500).json({
        error: 'The contact form is not fully set up yet. Please email mr.shakir77@gmail.com directly for now.',
      });
    }
    console.error('Contact API error:', err);
    return res.status(502).json({
      error: 'Could not send the message right now. Please try again or email mr.shakir77@gmail.com directly.',
    });
  }
};
