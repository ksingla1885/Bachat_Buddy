const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
  }
});

const FROM_EMAIL = process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@bachatbuddy.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'BachatBuddy';

exports.sendSignupOtpEmail = async (userEmail, { name, otp }) => {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'BachatBuddy Signup OTP - Verify Your Email',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hello <strong>${name || 'there'}</strong>,</p>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">Thank you for registering with BachatBuddy! To complete your signup, please use the OTP below:</p>
            <div style="background-color: #f0f4ff; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 5px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 10px;">Your One-Time Password:</p>
              <p style="margin: 0; font-size: 36px; font-weight: 700; color: #4f46e5; letter-spacing: 5px;">${otp}</p>
            </div>
            <p style="color: #f44336; font-size: 14px; text-align: center; margin: 20px 0;">⏱️ This code will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #999; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
              If you didn't request this, please ignore this email. Do not share this OTP with anyone.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 15px;">Best regards,<br><strong>The BachatBuddy Team</strong></p>
          </div>
        </div>
      `
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

exports.sendWelcomeEmail = async (userEmail, { name, email, password }) => {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Welcome to BachatBuddy - Your Personal Finance Manager',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🎉 Welcome to BachatBuddy!</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">Welcome aboard! Your BachatBuddy account has been successfully created. We're excited to help you manage your finances better.</p>
            <div style="background-color: #f0f4ff; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 5px; margin: 25px 0;">
              <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 12px;"><strong>Your Login Credentials:</strong></p>
              <p style="margin: 8px 0; color: #333; font-size: 14px;"><strong>Email:</strong> <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${email}</code></p>
              <p style="margin: 8px 0; color: #333; font-size: 14px;"><strong>Password:</strong> <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${password}</code></p>
            </div>
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 13px;">🔒 <strong>For security:</strong> We recommend changing your password after your first login.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 15px;">Go to Dashboard</a>
            </div>
            <p style="color: #999; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
              If you didn't create this account, please contact our support team immediately.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 15px;">Best regards,<br><strong>The BachatBuddy Team</strong></p>
          </div>
        </div>
      `
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

exports.send2FAOtpEmail = async (userEmail, { name, otp }) => {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'BachatBuddy Two-Factor Authentication Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 BachatBuddy-Your personal financial manager</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hello <strong>${name || 'there'}</strong>,</p>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">A login attempt has been detected on your BachatBuddy account. Please use the code below to verify it's you:</p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 5px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 10px;">Your Verification Code:</p>
              <p style="margin: 0; font-size: 36px; font-weight: 700; color: #10b981; letter-spacing: 5px;">${otp}</p>
            </div>
            <p style="color: #f44336; font-size: 14px; text-align: center; margin: 20px 0;">⏱️ This code will expire in <strong>10 minutes</strong>.</p>
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 13px;">⚠️ <strong>Never share this code with anyone.</strong> BachatBuddy will never ask for it via email or chat.</p>
            </div>
            <p style="color: #999; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
              If you didn't attempt to log in, please change your password immediately.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 15px;">Best regards,<br><strong>The BachatBuddy Security Team</strong></p>
          </div>
        </div>
      `
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
