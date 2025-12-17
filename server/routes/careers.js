const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/careers - Handle job application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;

    // Validate required fields
    if (!name || !email || !position) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and position' 
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
          subject: `Job Application: ${position}`,
          html: `
            <h2>New Job Application</h2>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Experience:</strong> ${experience || 'Not provided'}</p>
            <p><strong>Cover Letter:</strong></p>
            <p>${coverLetter || 'Not provided'}</p>
          `
        });
        console.log('Career application email sent successfully to guptasahil2175@gmail.com');

        // Send auto-reply to the applicant
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Application Received - ${position} at FoundryAI`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f1c 0%, #111827 100%); padding: 40px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Foundry<span style="background: linear-gradient(135deg, #0066ff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI</span></h1>
              </div>
              
              <div style="background: rgba(26, 34, 53, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
                <h2 style="color: #ffffff; margin-top: 0;">Hello ${name}! 🚀</h2>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  Thank you for your interest in joining <strong style="color: #0066ff;">FoundryAI</strong>! We're thrilled to confirm that we've received your application for the position of:
                </p>
                
                <div style="background: linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(0, 212, 255, 0.2)); border: 1px solid rgba(0, 102, 255, 0.3); border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                  <h3 style="color: #ffffff; margin: 0; font-size: 20px;">${position}</h3>
                </div>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  At FoundryAI, we don't just build products – we build the future. As a Startup Studio specializing in AI-powered ventures, we're always looking for talented individuals who share our passion for innovation and excellence.
                </p>
                
                <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    <strong>📋 What's Next?</strong><br>
                    <span style="color: #94a3b8;">Our hiring team will carefully review your application. If your profile matches our requirements, we'll reach out to schedule an initial conversation within 5-7 business days.</span>
                  </p>
                </div>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  <strong style="color: #ffffff;">Why FoundryAI?</strong>
                </p>
                <ul style="color: #94a3b8; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                  <li>Work on multiple cutting-edge AI startups</li>
                  <li>Collaborate with world-class engineers and entrepreneurs</li>
                  <li>Be at the forefront of artificial intelligence innovation</li>
                  <li>Shape the future of technology</li>
                </ul>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7;">
                  We appreciate you taking the time to apply and look forward to potentially welcoming you to our team!
                </p>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.7; margin-bottom: 0;">
                  Best of luck,<br>
                  <strong style="color: #ffffff;">The FoundryAI Talent Team</strong>
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
      message: 'Application submitted successfully! We will review and get back to you.' 
    });

  } catch (error) {
    console.error('Career application error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// GET /api/careers - Get job listings
router.get('/', (req, res) => {
  const jobs = [
    {
      id: 1,
      title: 'FullStack Developers with basic knowledge of Prompt Engineering',
      department: 'Engineering',
      type: 'Full time',
      location: 'Bangalore, India',
      description: 'Develop robust web applications and APIs with modern frameworks while leveraging AI prompt engineering for enhanced functionality.',
      requirements: [
        '3+ years Full Stack Development',
        'React/JavaScript expertise',
        'Database design',
        'Basic Prompt Engineering knowledge',
        'API development'
      ]
    },
    {
      id: 2,
      title: 'Software Engineer who have knowledge on GEO',
      department: 'Engineering',
      type: 'Full time',
      location: 'Bangalore, India',
      description: 'Build location based applications and services using geospatial technologies and mapping solutions.',
      requirements: [
        '2+ years Software Engineering',
        'GIS/Geospatial knowledge',
        'Mapping APIs experience',
        'Database systems',
        'Problem solving skills'
      ]
    },
    {
      id: 3,
      title: 'Performance Marketing Lead',
      department: 'Marketing',
      type: 'Full time',
      location: 'Bangalore, India',
      description: 'Lead performance marketing campaigns across digital channels to drive growth and user acquisition for our portfolio companies.',
      requirements: [
        '5+ years Performance Marketing',
        'Digital advertising platforms',
        'Analytics and data driven approach',
        'Campaign optimization',
        'Team leadership'
      ]
    }
  ];

  res.json(jobs);
});

module.exports = router;
