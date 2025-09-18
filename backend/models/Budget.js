const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  alertThreshold: {
    type: Number,
    default: 0.8,
    min: 0,
    max: 1
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// ===============================
// Database Indexes for Performance
// ===============================
// Index for user-specific budget queries
budgetSchema.index({ userId: 1, month: 1, year: 1 });

// Index for category-based budget queries
budgetSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
