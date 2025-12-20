const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware - CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://foundryai-sg.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.some(allowed => cleanOrigin === allowed.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection (optional - for contact form)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully');
    } else {
      console.log('ℹ️  MongoDB URI not provided - running without database');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('ℹ️  Continuing without database - Forms will still work with email only');
  }
};

connectDB();

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/admin', require('./routes/admin'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
