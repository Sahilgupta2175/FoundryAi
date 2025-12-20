const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { sendEmail } = require('../services/emailService');

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

// Meeting Schema for scheduled calls
const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  services: [String],
  socialMedia: String,
  documents: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

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

    // Send email notification
    try {
      // Send notification to admin
      await sendEmail({
        to: 'guptasahil2175@gmail.com',
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
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
      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
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

// POST /api/contact/schedule - Schedule a meeting
router.post('/schedule', async (req, res) => {
  try {
    const { name, email, phone, industry, services, socialMedia, documents, date, time } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !industry || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Save meeting to MongoDB if connected
    let savedMeeting = null;
    if (mongoose.connection.readyState === 1) {
      try {
        savedMeeting = await Meeting.create({
          name,
          email,
          phone,
          industry,
          services,
          socialMedia,
          documents,
          date: new Date(date),
          time,
        });
        console.log("Meeting scheduled in database:", savedMeeting._id);
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }
    }

    const meetingDate = new Date(date);
    const formattedDate = meetingDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Send email notification to admin
    try {
      await sendEmail({
        to: 'guptasahil2175@gmail.com',
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `🗓️ New Meeting Scheduled: ${name} - ${formattedDate} at ${time}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f1c 0%, #111827 100%); padding: 40px; border-radius: 16px;">
            <h1 style="color: #ffffff; text-align: center;">New Meeting Scheduled! 📅</h1>
            
            <div style="background: rgba(26, 34, 53, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-top: 20px;">
              <h2 style="color: #0066ff; margin-top: 0;">Meeting Details</h2>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Date:</strong> ${formattedDate}</p>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Time:</strong> ${time}</p>
              
              <h3 style="color: #0066ff; margin-top: 25px;">Client Information</h3>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Name:</strong> ${name}</p>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Email:</strong> ${email}</p>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Phone:</strong> ${phone}</p>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Industry:</strong> ${industry}</p>
              
              <h3 style="color: #0066ff; margin-top: 25px;">Services Interested In</h3>
              <ul style="color: #94a3b8;">
                ${services && services.length > 0 ? services.map(s => `<li>${s}</li>`).join('') : '<li>Not specified</li>'}
              </ul>
              
              <h3 style="color: #0066ff; margin-top: 25px;">Additional Information</h3>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Social Media:</strong> ${socialMedia || 'Not provided'}</p>
              <p style="color: #94a3b8;"><strong style="color: #fff;">Documents:</strong> ${documents || 'Not provided'}</p>
            </div>
          </div>
        `
      });

      // Send WhatsApp notification via WhatsApp Business API (if configured)
      // For now, we'll send an SMS-style notification via email
      // You can integrate with Twilio WhatsApp API or WhatsApp Business Cloud API

      console.log('Meeting notification sent successfully');

      // Send confirmation email to the client
      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `Meeting Confirmed - ${formattedDate} at ${time}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f1c 0%, #111827 100%); padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Foundry<span style="background: linear-gradient(135deg, #0066ff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI</span></h1>
            </div>
            
            <div style="background: rgba(26, 34, 53, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
              <h2 style="color: #ffffff; margin-top: 0;">Your Meeting is Confirmed! ✅</h2>
              
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                Hello ${name},
              </p>
              
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                Your consultation call with FoundryAI has been scheduled.
              </p>
              
              <div style="background: rgba(0, 102, 255, 0.2); border: 1px solid rgba(0, 102, 255, 0.3); border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h3 style="color: #ffffff; margin: 0;">📅 ${formattedDate}</h3>
                <p style="color: #0066ff; font-size: 20px; margin: 10px 0;">🕐 ${time}</p>
              </div>
              
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                We'll reach out to you via the contact details you provided. Please ensure you're available at the scheduled time.
              </p>
              
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.7; margin-bottom: 0;">
                Looking forward to speaking with you!<br>
                <strong style="color: #ffffff;">The FoundryAI Team</strong>
              </p>
            </div>
          </div>
        `
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Meeting scheduled successfully! You will receive a confirmation shortly.'
    });

  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// GET /api/contact/meetings - Get all scheduled meetings (protected)
router.get('/meetings', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const meetings = await Meeting.find()
      .sort({ date: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
