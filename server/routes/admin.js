const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { sendEmail } = require('../services/emailService');
const { generateEmailTemplate } = require('../services/emailTemplates');

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Job Application Schema (reuse from careers.js)
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  position: { type: String, required: true },
  experience: String,
  resumeUrl: String,
  resumeFilename: String,
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'shortlisted', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

// Meeting Schema (must match contact.js schema)
const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: String,
  industry: { type: String, required: true },
  services: [String],
  socialMedia: String,
  documents: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] },
  cancellationReason: String,
  cancelledAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

// Middleware to verify admin JWT token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// POST /api/admin/login - Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// POST /api/admin/register - Create admin (use this once to create first admin)
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, password, and email",
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// GET /api/admin/applications - Get all job applications
router.get("/applications", verifyAdminToken, async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // Filter by status if provided
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status && ['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Get applications with pagination
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
});

// GET /api/admin/applications/:id - Get single application
router.get("/applications/:id", verifyAdminToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Fetch application error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
    });
  }
});

// PATCH /api/admin/applications/:id/status - Update application status
router.patch("/applications/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
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

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
});

// DELETE /api/admin/applications/:id - Delete application
router.delete("/applications/:id", verifyAdminToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", verifyAdminToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const reviewed = await Application.countDocuments({ status: 'reviewed' });
    const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await Application.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        reviewed,
        shortlisted,
        rejected,
        recent,
      },
    });
  } catch (error) {
    console.error("Fetch stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

// GET /api/admin/meetings - Get all scheduled meetings
router.get("/meetings", verifyAdminToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Get all meetings, sorted by date (upcoming first)
    const meetings = await Meeting.find()
      .sort({ date: 1, time: 1 });

    // Format the date for display
    const formattedMeetings = meetings.map(meeting => ({
      ...meeting.toObject(),
      date: new Date(meeting.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

    res.status(200).json({
      success: true,
      meetings: formattedMeetings,
    });
  } catch (error) {
    console.error("Fetch meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
});

// PATCH /api/admin/meetings/:id/status - Update meeting status
router.patch("/meetings/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting status updated successfully",
      meeting,
    });
  } catch (error) {
    console.error("Update meeting status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update meeting status",
    });
  }
});

// POST /api/admin/meetings/:id/cancel - Cancel meeting and notify user
router.post("/meetings/:id/cancel", verifyAdminToken, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Find the meeting first to get user details
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (meeting.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Meeting is already cancelled",
      });
    }

    // Update meeting status to cancelled
    meeting.status = 'cancelled';
    meeting.cancellationReason = reason;
    meeting.cancelledAt = new Date();
    await meeting.save();

    // Format the date for email
    const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send cancellation email to user
    try {
      const cancellationEmailContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 25px 0; font-size: 22px;">Meeting Cancelled</h2>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">YOUR SCHEDULED MEETING ON</p>
          <h3 style="color: #dc2626; margin: 0; font-size: 20px;">${formattedDate}</h3>
          <p style="color: #1a1a1a; font-size: 18px; margin: 5px 0 0 0; font-weight: 600;">${meeting.time}</p>
          <p style="color: #dc2626; font-size: 14px; margin: 10px 0 0 0; font-weight: 600;">HAS BEEN CANCELLED</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px;">Reason for Cancellation</h3>
              <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0;">${reason}</p>
            </td>
          </tr>
        </table>

        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">Reschedule Your Meeting</h3>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">We apologize for any inconvenience. Please feel free to schedule a new meeting at your convenience through our website.</p>
        </div>

        <p style="color: #666; font-size: 14px; margin: 0;">If you have any questions, please don't hesitate to contact us.</p>
      `;

      const emailHtml = generateEmailTemplate('Meeting Cancelled', cancellationEmailContent);

      await sendEmail({
        to: meeting.email,
        subject: 'Meeting Cancelled - Foundry AI',
        html: emailHtml,
      });

      console.log('Cancellation email sent to:', meeting.email);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Continue even if email fails - meeting is still cancelled
    }

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully and notification sent",
      meeting,
    });
  } catch (error) {
    console.error("Cancel meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel meeting",
    });
  }
});

module.exports = router;
