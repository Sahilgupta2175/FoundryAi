const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact Schema (optional MongoDB storage)
const contactSchema = {
  name: String,
  email: String,
  phone: String,
  company: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
};

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and message' 
      });
    }

    // Send email notification (configure in production)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
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

      try {
        // Send notification to admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'guptasahil2175@gmail.com',
          subject: `New Contact: ${subject || 'General Inquiry'}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });
        console.log('Contact email sent successfully to guptasahil2175@gmail.com');

        // Send auto-reply to the user
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Thank You for Contacting FoundryAI - We've Received Your Message`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f1c 0%, #111827 100%); padding: 40px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Foundry<span style="background: linear-gradient(135deg, #0066ff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI</span></h1>
              </div>
              
              <div style="background: rgba(26, 34, 53, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
                <h2 style="color: #ffffff; margin-top: 0;">Hello ${name}! 👋</h2>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  Thank you for reaching out to <strong style="color: #0066ff;">FoundryAI</strong>! We've successfully received your message and our team is excited to connect with you.
                </p>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  At FoundryAI, we're passionate about transforming visionary ideas into successful AI-powered ventures. Whether you're looking to discuss a potential partnership, explore our services, or simply learn more about what we do, we're here to help.
                </p>
                
                <div style="background: rgba(0, 102, 255, 0.1); border-left: 4px solid #0066ff; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    <strong>What happens next?</strong><br>
                    <span style="color: #94a3b8;">Our team will review your message and get back to you within 24-48 business hours. For urgent matters, feel free to reach us directly at foundryai.india@gmail.com</span>
                  </p>
                </div>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  In the meantime, feel free to explore our website to learn more about our AI-first approach to building successful startups.
                </p>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7; margin-bottom: 0;">
                  Best regards,<br>
                  <strong style="color: #ffffff;">The FoundryAI Team</strong>
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                  © 2024 FoundryAI. Building the Future, Together.<br>
                  Bangalore, India
                </p>
              </div>
            </div>
          `
        });
        console.log('Auto-reply sent successfully to', email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Continue anyway - don't fail the request
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

module.exports = router;
