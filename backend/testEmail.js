require('dotenv').config();
const { sendTestEmail } = require('./utils/emailService');

const target = process.argv[2] || process.env.TEST_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER;

if (!target) {
  console.error('No target email specified. Provide an email as first arg or set TEST_EMAIL/SMTP_USER/EMAIL_USER in .env');
  process.exit(1);
}

(async () => {
  try {
    console.log(`Sending test email to ${target}...`);
    const info = await sendTestEmail(target);
    console.log('Test email sent successfully:', info && info.messageId ? info.messageId : info);
    process.exit(0);
  } catch (err) {
    console.error('Test email failed:', err);
    process.exit(2);
  }
})();
