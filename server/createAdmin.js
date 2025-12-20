/**
 * Script to create the first admin user
 * Run this script once to create your first admin account
 * 
 * Usage: node createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env file');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get admin details from command line or use defaults
    const username = process.argv[2] || 'sahilgupta2175';
    const password = process.argv[3] || 'Sahilgupta#cs22';
    const email = process.argv[4] || 'guptasahil2175@gmail.com';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    
    if (existingAdmin) {
      console.log('⚠️  Admin with this username or email already exists');
      console.log('Existing admin:', {
        username: existingAdmin.username,
        email: existingAdmin.email
      });
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    console.log('👤 Creating admin user...');
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      email,
    });

    console.log('\n✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 IMPORTANT: Save these credentials securely!');
    console.log('🌐 Login at: http://localhost:3000/admin/login');
    console.log('\n⚠️  WARNING: For security, change this password after first login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Show usage if --help flag is provided
if (process.argv.includes('--help')) {
  console.log(`
Create Admin User Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  node createAdmin.js [username] [password] [email]

Examples:
  node createAdmin.js
  node createAdmin.js admin MySecurePassword123 admin@example.com
  node createAdmin.js johndoe Pass@word123 john@example.com

Default values (if not provided):
  Username: admin
  Password: Admin@123
  Email: admin@foundryai.com

Requirements:
  - MONGODB_URI must be set in .env file
  - MongoDB must be accessible
  `);
  process.exit(0);
}

createAdmin();
