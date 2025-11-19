const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

// Development-only endpoint to trigger a test email and return result
exports.sendTestEmail = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'Debug endpoint disabled in production' });
  }

  const to = req.query.to || process.env.SMTP_USER || process.env.EMAIL_USER;
  if (!to) {
    return res.status(400).json({ ok: false, error: 'Missing `to` query param and no default sender configured' });
  }

  try {
    const result = await emailService.sendTestEmail(to);
    return res.json({ ok: true, result });
  } catch (err) {
    logger.error('Debug sendTestEmail failed:', err);
    return res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
};

// Development-only endpoint to verify SMTP credentials without restarting
exports.verifySmtp = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'Debug endpoint disabled in production' });
  }

  // Build transporter options from env (same logic as emailService)
  const nodemailer = require('nodemailer');
  const transporterOptions = {
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_USER,
      pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '1' ? true : false
    }
  };

  try {
    const tempTransporter = nodemailer.createTransport(transporterOptions);
    await tempTransporter.verify();
    return res.json({ ok: true, message: 'SMTP verification succeeded' });
  } catch (err) {
    logger.error('SMTP verification failed (debug):', err);
    return res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err), details: err });
  }
};
