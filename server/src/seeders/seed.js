import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../utils/database.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@org.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists');
      console.log('Email: admin@org.com');
      console.log('Password: admin123');
    } else {
      // Create admin user
      const admin = await User.create({
        name: 'System Admin',
        email: 'admin@org.com',
        password: 'admin123', // Will be hashed by User model pre-save hook
        role: 'admin'
      });

      console.log('✅ Admin created successfully');
      console.log('Email: admin@org.com');
      console.log('Password: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
