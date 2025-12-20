const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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
  resumePublicId: String,
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'shortlisted', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

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

module.exports = router;
