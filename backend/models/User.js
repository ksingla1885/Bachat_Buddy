const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: {
    type: String,
    required: false // Not required for Google OAuth users
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true // Allows multiple null values for googleId
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  firstBudgetDate: {
    type: Date,
    default: null
  },
  budgetComplianceMonths: {
    type: [Date],
    default: []
  },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
