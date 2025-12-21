const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { sendEmail } = require('../services/emailService');
const { generateEmailTemplate } = require('../services/emailTemplates');

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

    // Validate required fields (all required except company)
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, phone, subject, and message' 
      });
    }

    // Send email notification
    try {
      // Send notification to admin
      const adminEmailContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 25px 0; font-size: 22px;">New Contact Message</h2>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Subject</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${subject || 'Not provided'}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Name</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Email</span><br>
                    <a href="mailto:${email}" style="color: #0066ff; font-size: 15px;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Phone</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${phone || 'Not provided'}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #666; font-size: 13px;">Company</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${company || 'Not provided'}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Message</h3>
        <div style="background-color: #f9fafb; border-left: 3px solid #0066ff; padding: 15px; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.6;">${message}</p>
        </div>
      `;

      await sendEmail({
        to: 'guptasahil2175@gmail.com',
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `New Contact: ${subject || 'General Inquiry'}`,
        html: generateEmailTemplate(`New Contact Form Submission`, adminEmailContent, `New message from ${name}: ${subject}`)
      });
      console.log('Contact email sent successfully to guptasahil2175@gmail.com');

      // Send auto-reply to the user
      const userEmailContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">Hello ${name}! 👋</h2>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          Thank you for reaching out to <strong style="color: #0066ff;">FoundryAI</strong>! We've successfully received your message and our team is excited to connect with you.
        </p>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          At FoundryAI, we're passionate about transforming visionary ideas into successful AI-powered ventures. Whether you're looking to discuss a potential partnership, explore our services, or simply learn more about what we do, we're here to help.
        </p>
        
        <div style="background-color: #f0f7ff; border-left: 3px solid #0066ff; padding: 15px; margin: 0 0 25px 0; border-radius: 0 6px 6px 0;">
          <p style="color: #444; margin: 0; font-size: 14px;">
            <strong style="color: #1a1a1a;">What happens next?</strong><br>
            Our team will review your message and get back to you within 24-48 business hours. For urgent matters, reach us at foundryai.india@gmail.com
          </p>
        </div>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0;">
          Best regards,<br>
          <strong style="color: #1a1a1a;">The FoundryAI Team</strong>
        </p>
      `;

      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `Thank You for Contacting FoundryAI - We've Received Your Message`,
        html: generateEmailTemplate(`Message Received`, userEmailContent, `Thanks for contacting FoundryAI`)
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

    const meetingDate = new Date(date);
    
    // Check for scheduling conflicts
    if (mongoose.connection.readyState === 1) {
      // Find meetings on the same date with the same time
      const startOfDay = new Date(meetingDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(meetingDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const existingMeeting = await Meeting.findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        time: time,
        status: { $ne: 'cancelled' }
      });
      
      if (existingMeeting) {
        return res.status(409).json({
          success: false,
          message: `This time slot (${time}) is already booked for ${meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Please select a different time.`
        });
      }
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
          date: meetingDate,
          time,
        });
        console.log("Meeting scheduled in database:", savedMeeting._id);
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }
    }

    const formattedDate = meetingDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Send email notification to admin
    try {
      const adminMeetingContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 25px 0; font-size: 22px;">New Meeting Scheduled</h2>
        
        <div style="background-color: #f0f7ff; border: 1px solid #d0e3ff; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">SCHEDULED FOR</p>
          <h3 style="color: #0066ff; margin: 0; font-size: 20px;">${formattedDate}</h3>
          <p style="color: #1a1a1a; font-size: 18px; margin: 5px 0 0 0; font-weight: 600;">${time}</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px;">Client Information</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Name</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Email</span><br>
                    <a href="mailto:${email}" style="color: #0066ff; font-size: 15px;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Phone</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${phone}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #666; font-size: 13px;">Industry</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${industry}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Services Interested In</h3>
        <ul style="color: #444; font-size: 14px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
          ${services && services.length > 0 ? services.map(s => `<li>${s}</li>`).join('') : '<li>Not specified</li>'}
        </ul>
        
        <p style="color: #444; font-size: 14px; margin: 0 0 5px 0;"><strong style="color: #1a1a1a;">Social Media:</strong> ${socialMedia || 'Not provided'}</p>
        <p style="color: #444; font-size: 14px; margin: 0;"><strong style="color: #1a1a1a;">Documents:</strong> ${documents || 'Not provided'}</p>
      `;

      await sendEmail({
        to: 'guptasahil2175@gmail.com',
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `New Meeting Scheduled: ${name} - ${formattedDate} at ${time}`,
        html: generateEmailTemplate(`New Meeting Scheduled`, adminMeetingContent, `Meeting with ${name} on ${formattedDate}`)
      });

      // Send WhatsApp notification via WhatsApp Business API (if configured)
      // For now, we'll send an SMS-style notification via email
      // You can integrate with Twilio WhatsApp API or WhatsApp Business Cloud API

      console.log('Meeting notification sent successfully');

      // Send confirmation email to the client
      const userMeetingContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">Your Meeting is Confirmed!</h2>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          Hello ${name}, your consultation call with FoundryAI has been scheduled.
        </p>
        
        <div style="background-color: #f0f7ff; border: 1px solid #d0e3ff; border-radius: 6px; padding: 20px; text-align: center; margin: 0 0 25px 0;">
          <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">YOUR MEETING</p>
          <h3 style="color: #0066ff; margin: 0; font-size: 20px;">${formattedDate}</h3>
          <p style="color: #1a1a1a; font-size: 18px; margin: 5px 0 0 0; font-weight: 600;">${time}</p>
        </div>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          We'll reach out to you via the contact details you provided. Please ensure you're available at the scheduled time.
        </p>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0;">
          Looking forward to speaking with you!<br>
          <strong style="color: #1a1a1a;">The FoundryAI Team</strong>
        </p>
      `;

      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || 'noreply@foundryai.com',
        subject: `Meeting Confirmed - ${formattedDate} at ${time}`,
        html: generateEmailTemplate(`Meeting Confirmed`, userMeetingContent, `Your meeting on ${formattedDate} is confirmed`)
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
