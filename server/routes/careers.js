const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/emailService");
const { generateEmailTemplate } = require("../services/emailTemplates");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer (files stored in memory before Cloudinary upload)
const storage = multer.memoryStorage();

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
  coverLetter: String,
  resumeUrl: String,
  resumePublicId: String, // Cloudinary public ID for deletion if needed
  resumeFilename: String,
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'shortlisted', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

// Job Opening Schema for MongoDB
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true, enum: ['Full time', 'Part time', 'Contract', 'Internship'] },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  salary: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Only create model if it doesn't exist
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

// POST /api/careers/upload-resume - Upload resume to Cloudinary
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Generate a unique filename with timestamp
    const originalName = req.file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const extension = req.file.originalname.split('.').pop();
    // For raw files, we need to include extension in public_id
    const publicId = `resumes/${originalName}_${timestamp}.${extension}`;

    // Upload to Cloudinary using upload_stream
    // We use resource_type: "raw" to avoid "Blocked for delivery" issues with PDFs 
    // on some Cloudinary accounts that restrict PDF/ZIP delivery via image pipeline
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: publicId,
          folder: "foundryai_resumes",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    console.log("Resume uploaded to Cloudinary:");
    console.log("  Original name:", req.file.originalname);
    console.log("  Cloudinary URL:", uploadResult.secure_url);
    console.log("  Public ID:", uploadResult.public_id);

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      originalName: req.file.originalname,
      message: "Resume uploaded successfully to Cloudinary",
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
});

// Note: Files are now served directly from Cloudinary, no local file serving needed

// POST /api/careers - Handle job application
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter, resumeUrl, resumePublicId, resumeFilename } = req.body;

    // Validate required fields (all required except coverLetter)
    if (!name || !email || !phone || !position || !experience) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, phone, position, and experience",
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
          coverLetter,
          resumeUrl,
          resumePublicId,
          resumeFilename,
        });
        console.log("Application saved to database:", savedApplication._id);
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }
    }

    // Send email notification
    try {
      // Send notification to admin with resume link
      const adminEmailContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 25px 0; font-size: 22px;">New Job Application</h2>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Position</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${position}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #666; font-size: 13px;">Applicant Name</span><br>
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
                    <strong style="color: #1a1a1a; font-size: 15px;">${phone || "Not provided"}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #666; font-size: 13px;">Experience</span><br>
                    <strong style="color: #1a1a1a; font-size: 15px;">${experience || "Not provided"}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Cover Letter / Description</h3>
        <div style="background-color: #f9fafb; border-left: 3px solid #0066ff; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.6;">
            ${coverLetter ? coverLetter.replace(/\n/g, '<br>') : "Not provided"}
          </p>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          ${resumeUrl ? `<a href="${resumeUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #0066ff; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Resume</a>` : '<p style="color: #888; margin: 0;">No resume uploaded</p>'}
        </div>
        
        ${savedApplication ? `<p style="font-size: 12px; color: #999; text-align: center; margin: 20px 0 0 0;">Application ID: ${savedApplication._id}</p>` : ''}
      `;

      await sendEmail({
        to: "guptasahil2175@gmail.com",
        from: process.env.EMAIL_USER || "noreply@foundryai.com",
        subject: `Job Application: ${position}`,
        html: generateEmailTemplate(`New Job Application`, adminEmailContent, `New application for ${position} from ${name}`),
      });
      console.log(
        "Career application email sent successfully to guptasahil2175@gmail.com"
      );

      // Send auto-reply to the applicant
      const userEmailContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">Hello ${name}! 🚀</h2>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          Thank you for your interest in joining <strong style="color: #0066ff;">FoundryAI</strong>! We're thrilled to confirm that we've received your application for:
        </p>
        
        <div style="background-color: #f0f7ff; border: 1px solid #d0e3ff; border-radius: 6px; padding: 15px; text-align: center; margin: 0 0 25px 0;">
          <h3 style="color: #0066ff; margin: 0; font-size: 18px;">${position}</h3>
        </div>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          At FoundryAI, we don't just build products – we build the future. As a Startup Studio specializing in AI-powered ventures, we're always looking for talented individuals who share our passion for innovation.
        </p>
        
        <div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 15px; margin: 0 0 25px 0; border-radius: 0 6px 6px 0;">
          <p style="color: #444; margin: 0; font-size: 14px;">
            <strong style="color: #1a1a1a;">📋 What's Next?</strong><br>
            Our hiring team will carefully review your application. If your profile matches our requirements, we'll reach out within 5-7 business days.
          </p>
        </div>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 10px 0;">
          <strong style="color: #1a1a1a;">Why FoundryAI?</strong>
        </p>
        <ul style="color: #444; font-size: 14px; line-height: 1.8; margin: 0 0 25px 0; padding-left: 20px;">
          <li>Work on multiple cutting-edge AI startups</li>
          <li>Collaborate with world-class engineers and entrepreneurs</li>
          <li>Be at the forefront of artificial intelligence innovation</li>
        </ul>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0;">
          Best of luck,<br>
          <strong style="color: #1a1a1a;">The FoundryAI Team</strong>
        </p>
      `;

      await sendEmail({
        to: email,
        from: process.env.EMAIL_USER || "noreply@foundryai.com",
        subject: `Application Received - ${position} at FoundryAI`,
        html: generateEmailTemplate(`Application Received`, userEmailContent, `We've received your application for ${position}`),
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

// GET /api/careers - Get active job listings
router.get("/", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Fetch active jobs from database
      const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
      
      if (jobs.length > 0) {
        return res.json(jobs);
      }
    }
    
    // Fallback to default jobs if database is empty or not connected
    const defaultJobs = [
      {
        _id: '1',
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
        _id: '2',
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
        _id: '3',
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

    res.json(defaultJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
});

// GET /api/careers/applications - Get all applications (protected route for hiring)
router.get("/applications", async (req, res) => {
  try {
    // Simple API key authentication (you can enhance this)

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

// PATCH /api/careers/applications/:id - Update application status
router.patch("/applications/:id", async (req, res) => {
  try {

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
