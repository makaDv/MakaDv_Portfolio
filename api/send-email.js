const fetch = global.fetch || require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const origin = req.headers.origin || req.headers.referer || '';
    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    if (allowedOrigin && (!origin || !origin.includes(allowedOrigin))) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }
    if (name.length > 100 || email.length > 255 || message.length > 2000) {
      res.status(400).json({ error: 'Payload too large' });
      return;
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const SENDGRID_FROM = process.env.SENDGRID_FROM || 'no-reply@example.com';
    const SENDGRID_TO = process.env.SENDGRID_TO || 'dvdavide07@gmail.com';

    if (!SENDGRID_API_KEY) {
      res.status(500).json({ error: 'SendGrid API key not configured' });
      return;
    }

    const payload = {
      personalizations: [
        {
          to: [{ email: SENDGRID_TO }],
          subject: `New message from ${name}`,
        },
      ],
      from: { email: SENDGRID_FROM },
      reply_to: { email },
      content: [
        {
          type: 'text/plain',
          value: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        },
      ],
    };

    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const body = await r.text();
      console.error('SendGrid error', r.status, body);
      res.status(r.status).json({ error: 'SendGrid error', detail: body });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-email handler error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
