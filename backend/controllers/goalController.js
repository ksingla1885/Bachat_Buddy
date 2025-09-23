const Goal = require('../models/Goal');
const User = require('../models/User');
const PointsLog = require('../models/PointsLog');
const { clearUserCache } = require('../middleware/cache');
const mongoose = require('mongoose');

// ================================
// Create Goal
// ================================
exports.createGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, category } = req.body;

    // Validate required fields
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, target amount, and deadline are required'
      });
    }

    const goal = new Goal({
      userId: req.user.id,
      title,
      description,
      targetAmount: Number(targetAmount),
      deadline: new Date(deadline),
      category: category || 'other'
    });

    await goal.save();

    // Clear user cache
    clearUserCache(req.user.id);

    res.status(201).json({
      status: 'success',
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create goal'
    });
  }
};

// ================================
// Get User Goals
// ================================
exports.getGoals = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const goals = await Goal.find(filter)
      .sort({ deadline: 1, createdAt: -1 })
      .limit(limitNum * 1)
      .skip((pageNum - 1) * limitNum);

    const total = await Goal.countDocuments(filter);

    res.json({
      status: 'success',
      results: goals.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalResults: total
      },
      data: goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch goals'
    });
  }
};

// ================================
// Get Single Goal
// ================================
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }

    res.json({
      status: 'success',
      data: goal
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch goal'
    });
  }
};

// ================================
// Update Goal
// ================================
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, category, savedAmount } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }

    // Update fields if provided
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetAmount) goal.targetAmount = Number(targetAmount);
    if (deadline) goal.deadline = new Date(deadline);
    if (category) goal.category = category;
    if (savedAmount !== undefined) goal.savedAmount = Number(savedAmount);

    await goal.save();

    // Clear user cache
    clearUserCache(req.user.id);

    res.json({
      status: 'success',
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update goal'
    });
  }
};

// ================================
// Delete Goal
// ================================
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }

    // Clear user cache
    clearUserCache(req.user.id);

    res.json({
      status: 'success',
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete goal'
    });
  }
};

// ================================
// Add Savings to Goal
// ================================
exports.addSavingsToGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Savings amount must be greater than 0'
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }

    if (goal.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Goal is already completed'
      });
    }

    const previousSavedAmount = goal.savedAmount;
    await goal.addSavings(Number(amount));

    let pointsEarned = 0;

    // Award points for adding savings (5 points per 1000 INR)
    pointsEarned += Math.floor(amount / 1000) * 5;

    // Award bonus points if goal is completed
    if (goal.status === 'completed') {
      pointsEarned += 100; // Goal completion bonus

      await PointsLog.create({
        userId: req.user.id,
        points: 100,
        reason: 'goal_completed',
        description: `Earned 100 bonus points for completing goal: ${goal.title}`,
        relatedId: goal._id,
        relatedModel: 'Goal'
      });
    }

    // Award regular savings points
    if (Math.floor(amount / 1000) * 5 > 0) {
      await PointsLog.create({
        userId: req.user.id,
        points: Math.floor(amount / 1000) * 5,
        reason: 'goal_savings',
        description: `Earned ${Math.floor(amount / 1000) * 5} points for adding ₹${amount} to goal: ${goal.title}`,
        relatedId: goal._id,
        relatedModel: 'Goal'
      });
    }

    // Update user points
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { points: pointsEarned } }
      );
    }

    // Clear user cache
    clearUserCache(req.user.id);

    res.json({
      status: 'success',
      message: 'Savings added to goal successfully',
      data: {
        goal,
        pointsEarned
      }
    });
  } catch (error) {
    console.error('Add savings to goal error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to add savings to goal'
    });
  }
};

// ================================
// Get Goal Stats
// ================================
exports.getGoalStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Goal.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalGoals: { $sum: 1 },
          completedGoals: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          inProgressGoals: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0]
            }
          },
          totalTargetAmount: { $sum: '$targetAmount' },
          totalSavedAmount: { $sum: '$savedAmount' },
          overdueGoals: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'in-progress'] },
                    { $lt: ['$deadline', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: stats[0] || {
        totalGoals: 0,
        completedGoals: 0,
        inProgressGoals: 0,
        totalTargetAmount: 0,
        totalSavedAmount: 0,
        overdueGoals: 0
      }
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch goal statistics'
    });
  }
};
