const mongoose = require('mongoose');

const pointsLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'budget_under_limit',
      'goal_completed',
      'goal_savings',
      'recurring_saving_streak',
      'debt_paid_off',
      'first_transaction',
      'weekly_login_streak'
    ]
  },
  description: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Reference to related object (budget, goal, etc.)
  },
  relatedModel: {
    type: String,
    enum: ['Budget', 'Goal', 'Debt', 'Transaction'],
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
pointsLogSchema.index({ userId: 1, createdAt: -1 });
pointsLogSchema.index({ reason: 1 });

module.exports = mongoose.model('PointsLog', pointsLogSchema);
