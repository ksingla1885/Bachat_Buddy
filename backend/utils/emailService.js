// Send 2FA OTP email
exports.send2FAOtpEmail = async (userEmail, { name, otp }) => {
  try {
    const mailer = transporter || (await transporterPromise);
    if (!mailer) {
      logger.warn('⚠️  Email transporter not available — 2FA OTP email not sent');
      return { ok: false, error: 'Email transporter not initialized' };
    }
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Your BachatBuddy 2FA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Two-Factor Authentication</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hello ${name || ''},</p>
            <p>Your verification code is:</p>
            <div style="font-size: 2rem; font-weight: bold; letter-spacing: 4px; margin: 20px 0; color: #4f46e5;">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
      text: `Hello ${name || ''},\nYour BachatBuddy 2FA code is: ${otp}\nThis code will expire in 10 minutes.`
    };
    await mailer.sendMail(mailOptions);
    logger.info(`✅ 2FA OTP email sent to ${userEmail}`);
    return { ok: true };
  } catch (error) {
    logger.error('Error sending 2FA OTP email:', error.message);
    return { ok: false, error: error.message };
  }
};
const nodemailer = require('nodemailer');
const logger = require('./logger');
require('dotenv').config();

// Email configuration
const isDev = process.env.NODE_ENV !== 'production';
const FROM_EMAIL = process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@bachatbuddy.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'BachatBuddy';

let transporter;

// Initialize email transporter
const initTransporter = async () => {
  if (transporter) return transporter;

  if (isDev) {
    // Development: Try Gmail first, fall back to Ethereal
    try {
      // First, try to use configured SMTP (Gmail or other provider)
      const gmailTransport = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.EMAIL_USER || process.env.SMTP_USER,
          pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '1' ? true : false
        }
      });

      // Try to verify Gmail transporter
      await gmailTransport.verify();
      transporter = gmailTransport;
      logger.info('✅ Email transporter (Gmail) verified and ready');
      return transporter;
    } catch (gmailErr) {
      logger.warn('⚠️  Gmail SMTP verification failed, falling back to Ethereal:', gmailErr.message);
      
      // Gmail failed, fall back to Ethereal for development
      try {
        const testAccount = await nodemailer.createTestAccount();
        logger.info('\n=== Ethereal Test Account (Development Fallback) ===');
        logger.info('Email:', testAccount.user);
        logger.info('Web Interface: https://ethereal.email/login\n');
        
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        logger.info('✅ Ethereal transporter ready (development fallback)');
        return transporter;
      } catch (etherealErr) {
        logger.error('❌ Both Gmail and Ethereal SMTP initialization failed:', etherealErr.message);
        // Don't throw — let the app start but email sending will fail gracefully
        return null;
      }
    }
  } else {
    // Production SMTP configuration
    transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER,
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '1'
      }
    });
  }

  if (transporter) {
    try {
      await transporter.verify();
      logger.info('✅ Email transporter verified');
      return transporter;
    } catch (err) {
      logger.error('❌ Transporter verification failed (will retry on send):', err.message);
      // Don't throw — email will attempt at send time
      return transporter;
    }
  }

  return null;
};

// Initialize transporter when the module loads
// Initialize asynchronously, but don't block server startup
let transporterPromise = initTransporter()
  .then(t => {
    if (!t) logger.warn('⚠️  Email transporter not initialized — emails may not be sent');
    return t;
  })
  .catch(err => {
    logger.error('Unexpected error during transporter init:', err);
    // Don't crash — let server start anyway
  });
// Send budget alert email
exports.sendBudgetAlert = async (userEmail, budgetData) => {
  try {
    // Ensure transporter is initialized
    const mailer = transporter || (await transporterPromise);
    if (!mailer) {
      logger.warn('⚠️  Email transporter not available — budget alert not sent');
      return false;
    }

    const { category, budgetAmount, spentAmount, threshold } = budgetData;
    
    const emailContent = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `Budget Alert: ${category} spending has reached ${threshold}%`,
      html: `
        <h2>Budget Alert</h2>
        <p>Your spending in the ${category} category has reached ${threshold}% of your budget.</p>
        <ul>
          <li>Budget Amount: ₹${budgetAmount}</li>
          <li>Amount Spent: ₹${spentAmount}</li>
          <li>Remaining: ₹${budgetAmount - spentAmount}</li>
        </ul>
        <p>Please review your spending to stay within your budget.</p>
        <p>Best regards,<br>BachatBuddy Team</p>
      `
    };

    await mailer.sendMail(emailContent);
    return true;
  } catch (error) {
    logger.error('Error sending budget alert email:', error.message);
    return false;
  }
};

// Send welcome email with credentials
exports.sendWelcomeEmail = async (userEmail, userData) => {
  try {
    // Ensure transporter is initialized
    const mailer = transporter || (await transporterPromise);
    if (!mailer) {
      logger.warn('⚠️  Email transporter not available — welcome email not sent');
      return { ok: false, error: 'Email transporter not initialized' };
    }

    const { name, email, password } = userData;
  
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Welcome to BachatBuddy - Your Personal Finance Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to BachatBuddy, ${name}!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Thank you for registering with BachatBuddy. We're excited to help you manage your finances better!</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4f46e5;">
              <h3 style="margin-top: 0; color: #111827;">Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">For security reasons, we recommend changing your password after your first login.</p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000/login" 
                 style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                Go to Dashboard
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
              If you didn't create an account, please ignore this email or contact support.
            </p>
          </div>
        </div>
      `,
      text: `Welcome to BachatBuddy, ${name}!

Thank you for registering with BachatBuddy. We're excited to help you manage your finances better!

Your Login Credentials:
Email: ${email}
Password: ${password}

For security reasons, we recommend changing your password after your first login.

Get started by logging in to your account and setting up your first budget!

Best regards,
The BachatBuddy Team

This is an automated message, please do not reply to this email.`
    };

    const info = await mailer.sendMail(mailOptions);
    
    // In development, log the preview URL if it's an Ethereal email
    if (isDev && info.response && info.response.includes('Ethereal')) {
      const preview = nodemailer.getTestMessageUrl(info);
      logger.info(`📧 Welcome email sent! Preview: ${preview}`);
      return { ok: true, preview };
    }
    
    logger.info(`✅ Welcome email sent to ${userEmail}`);
    return { ok: true };
  } catch (error) {
    logger.error('Error sending welcome email:', error.message);
    return { ok: false, error: error.message };
  }
};

// Send monthly budget summary
exports.sendMonthlySummary = async (userEmail, summaryData) => {
  try {
    // Ensure transporter is initialized
    const mailer = transporter || (await transporterPromise);
    if (!mailer) {
      logger.warn('⚠️  Email transporter not available — monthly summary not sent');
      return false;
    }

    const { month, year, categories } = summaryData;
    
    let categoriesHtml = categories
      .map(cat => `
        <tr>
          <td>${cat.name}</td>
          <td>₹${cat.budget}</td>
          <td>₹${cat.spent}</td>
          <td>${cat.percentage}%</td>
        </tr>
      `)
      .join('');

    const emailContent = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `Monthly Budget Summary - ${month}/${year}`,
      html: `
        <h2>Monthly Budget Summary</h2>
        <p>Here's your spending summary for ${month}/${year}:</p>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <th style="text-align: left;">Category</th>
            <th style="text-align: left;">Budget</th>
            <th style="text-align: left;">Spent</th>
            <th style="text-align: left;">% Used</th>
          </tr>
          ${categoriesHtml}
        </table>
        <p>Keep tracking your expenses with BachatBuddy!</p>
        <p>Best regards,<br>BachatBuddy Team</p>
      `
    };

    await mailer.sendMail(emailContent);
    return true;
  } catch (error) {
    logger.error('Error sending monthly summary email:', error.message);
    return false;
  }
};

// Send a simple test email (useful for debugging SMTP config)
exports.sendTestEmail = async (toEmail) => {
  try {
    // Ensure transporter is initialized
    const mailer = transporter || (await transporterPromise);
    if (!mailer) {
      return { ok: false, error: 'Email transporter not initialized' };
    }

    const target = toEmail || process.env.SMTP_USER || process.env.EMAIL_USER;
    const emailContent = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: target,
      subject: 'BachatBuddy — SMTP Test Message',
      text: `This is a test message from BachatBuddy. If you received this, SMTP configuration is working for ${target}.`
    };

    const info = await mailer.sendMail(emailContent);
    const preview = nodemailer.getTestMessageUrl(info) || null;
    logger.info(`Test email sent to ${target} - messageId: ${info.messageId}` + (preview ? ` - preview: ${preview}` : ''));
    return { ok: true, info, preview };
  } catch (error) {
    logger.error('Test email failed:', error.message);
    return { ok: false, error: error.message };
  }
};
