const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/emailService");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foundryai-resumes",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
    public_id: (req, file) => `resume-${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  }
});

// Job Application Schema for MongoDB
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  position: { type: String, required: true },
  experience: String,
  resumeUrl: String,
  resumePublicId: String,
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'shortlisted', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

// Only create model if it doesn't exist
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

// POST /api/careers/upload-resume - Upload resume to Cloudinary
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
});

// POST /api/careers - Handle job application
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, position, experience, resumeUrl } = req.body;

    // Validate required fields
    if (!name || !email || !position) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and position",
      });
    }

    // Save application to MongoDB if connected
    let savedApplication = null;
    if (mongoose.connection.readyState === 1) {
      try {
        savedApplication = await Application.create({
          name,
          email,
          phone,
          position,
          experience,
          resumeUrl,
        });
        console.log("Application saved to database:", savedApplication._id);
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }
    }

    // Send email notification
    try {
      // Send notification to admin with resume link
      await sendEmail({
        to: "guptasahil2175@gmail.com",
        from: process.env.EMAIL_USER || "noreply@foundryai.com",
        subject: `Job Application: ${position}`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>Position:</strong> ${position}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Experience:</strong> ${experience || "Not provided"}</p>
          ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}" target="_blank">View Resume</a></p>` : '<p><strong>Resume:</strong> Not uploaded</p>'}
          ${savedApplication ? `<p><strong>Application ID:</strong> ${savedApplication._id}</p>` : ''}
        `,
      });
      console.log(
        "Career application email sent successfully to guptasahil2175@gmail.com"
      );

      // Send auto-reply to the applicant
      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || "noreply@foundryai.com",
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
          `,
      });
      console.log("Auto-reply sent successfully to", email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Continue anyway - don't fail the request
    }

    res.status(200).json({
      success: true,
      message:
        "Application submitted successfully! We will review and get back to you.",
    });
  } catch (error) {
    console.error("Career application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// GET /api/careers - Get job listings
router.get("/", (req, res) => {
  const jobs = [
    {
      id: 1,
      title: "FullStack Developers with basic knowledge of Prompt Engineering",
      department: "Engineering",
      type: "Full time",
      location: "Bangalore, India",
      description:
        "Develop robust web applications and APIs with modern frameworks while leveraging AI prompt engineering for enhanced functionality.",
      requirements: [
        "3+ years Full Stack Development",
        "React/JavaScript expertise",
        "Database design",
        "Basic Prompt Engineering knowledge",
        "API development",
      ],
    },
    {
      id: 2,
      title: "Software Engineer who have knowledge on GEO",
      department: "Engineering",
      type: "Full time",
      location: "Bangalore, India",
      description:
        "Build location based applications and services using geospatial technologies and mapping solutions.",
      requirements: [
        "2+ years Software Engineering",
        "GIS/Geospatial knowledge",
        "Mapping APIs experience",
        "Database systems",
        "Problem solving skills",
      ],
    },
    {
      id: 3,
      title: "Performance Marketing Lead",
      department: "Marketing",
      type: "Full time",
      location: "Bangalore, India",
      description:
        "Lead performance marketing campaigns across digital channels to drive growth and user acquisition for our portfolio companies.",
      requirements: [
        "5+ years Performance Marketing",
        "Digital advertising platforms",
        "Analytics and data driven approach",
        "Campaign optimization",
        "Team leadership",
      ],
    },
  ];

  res.json(jobs);
});

// GET /api/careers/applications - Get all applications (protected route for hiring)
router.get("/applications", async (req, res) => {
  try {
    // Simple API key authentication (you can enhance this)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET /api/careers/applications/:id/resume - Proxy resume for preview/download
router.get("/applications/:id/resume", async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application || !application.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const { download } = req.query;
    const resumeUrl = application.resumeUrl;
    
    // Fetch the resume from Cloudinary
    const https = require('https');
    const http = require('http');
    const protocol = resumeUrl.startsWith('https') ? https : http;
    
    protocol.get(resumeUrl, (cloudinaryRes) => {
      // Get the content type from Cloudinary response
      let contentType = cloudinaryRes.headers['content-type'] || 'application/pdf';
      
      // Determine filename
      const originalFilename = application.resumeUrl.split('/').pop() || `resume-${application.name.replace(/\s+/g, '-')}`;
      const filename = originalFilename.includes('.') ? originalFilename : `${originalFilename}.pdf`;
      
      // Set appropriate headers
      if (download === 'true') {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      } else {
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      }
      
      // Set content type - force PDF for preview if file appears to be PDF
      if (filename.toLowerCase().endsWith('.pdf')) {
        contentType = 'application/pdf';
      }
      res.setHeader('Content-Type', contentType);
      
      // Pipe the response
      cloudinaryRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error fetching resume:', err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch resume",
      });
    });
  } catch (error) {
    console.error("Error serving resume:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET /api/careers/resume-url/:id - Get a signed/transformed URL for resume
router.get("/resume-url/:id", async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application || !application.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Return the resume URL info
    res.json({
      success: true,
      resumeUrl: application.resumeUrl,
      applicantName: application.name,
      position: application.position,
    });
  } catch (error) {
    console.error("Error getting resume URL:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// PATCH /api/careers/applications/:id - Update application status
router.patch("/applications/:id", async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
