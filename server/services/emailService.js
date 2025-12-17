const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Fallback nodemailer transporter (for local development)
const nodemailerTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send email using SendGrid (primary) or nodemailer (fallback)
 * @param {Object} mailOptions - Email options { to, from, subject, html, text }
 * @returns {Promise<Object>} - Result object with success status
 */
const sendEmail = async (mailOptions) => {
  try {
    // Try SendGrid first if API key is available
    if (process.env.SENDGRID_API_KEY) {
      console.log('📧 Sending email via SendGrid...');
      const msg = {
        to: mailOptions.to,
        from: mailOptions.from || process.env.EMAIL_USER,
        subject: mailOptions.subject,
        text: mailOptions.text || '',
        html: mailOptions.html || mailOptions.text
      };
      
      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid');
      return { success: true, method: 'sendgrid' };
    }
    
    // Fallback to nodemailer (for local development)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('📧 Sending email via nodemailer (SMTP)...');
      await nodemailerTransporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via nodemailer');
      return { success: true, method: 'nodemailer' };
    }
    
    // No email service configured
    console.warn('⚠️  No email service configured (missing SENDGRID_API_KEY or EMAIL credentials)');
    return { success: false, error: 'No email service configured' };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    throw error;
  }
};

module.exports = { sendEmail };
