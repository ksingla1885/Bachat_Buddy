const User = require('../models/User');
const PointsLog = require('../models/PointsLog');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Debt = require('../models/Debt');
const mongoose = require('mongoose');

// ================================
// Get User Points
// ================================
exports.getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        points: user.points
      }
    });
  } catch (error) {
    console.error('Get user points error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user points'
    });
  }
};

// ================================
// Get Points History
// ================================
exports.getPointsHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const pointsHistory = await PointsLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limitNum * 1)
      .skip((pageNum - 1) * limitNum);

    const total = await PointsLog.countDocuments({ userId: req.user.id });

    res.json({
      status: 'success',
      results: pointsHistory.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalResults: total
      },
      data: pointsHistory
    });
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch points history'
    });
  }
};

// ================================
// Award Points for Budget Management
// ================================
exports.awardBudgetPoints = async (userId, budgetId) => {
  try {
    const budget = await Budget.findById(budgetId);

    if (!budget || budget.userId.toString() !== userId.toString()) {
      return;
    }

    // Check if user stayed under budget this month
    const utilizationPercentage = (budget.spentAmount / budget.budgetedAmount) * 100;

    if (utilizationPercentage < 100) {
      const pointsEarned = 50;

      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } });

      await PointsLog.create({
        userId,
        points: pointsEarned,
        reason: 'budget_under_limit',
        description: `Earned ${pointsEarned} points for staying under budget in ${budget.category}`,
        relatedId: budgetId,
        relatedModel: 'Budget'
      });

      console.log(`Awarded ${pointsEarned} points to user ${userId} for budget management`);
    }
  } catch (error) {
    console.error('Award budget points error:', error);
  }
};

// ================================
// Award Points for Goal Completion
// ================================
exports.awardGoalCompletionPoints = async (userId, goalId) => {
  try {
    const goal = await Goal.findById(goalId);

    if (!goal || goal.userId.toString() !== userId.toString()) {
      return;
    }

    if (goal.status === 'completed') {
      const pointsEarned = 100;

      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } });

      await PointsLog.create({
        userId,
        points: goalId,
        points: pointsEarned,
        reason: 'goal_completed',
        description: `Earned ${pointsEarned} bonus points for completing goal: ${goal.title}`,
        relatedId: goalId,
        relatedModel: 'Goal'
      });

      console.log(`Awarded ${pointsEarned} points to user ${userId} for goal completion`);
    }
  } catch (error) {
    console.error('Award goal completion points error:', error);
  }
};

// ================================
// Award Points for Recurring Saving Streak
// ================================
exports.awardRecurringSavingPoints = async (userId) => {
  try {
    // Check if user has maintained a recurring saving streak
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSavings = await Goal.find({
      userId,
      status: 'in-progress',
      updatedAt: { $gte: thirtyDaysAgo }
    });

    if (recentSavings.length > 0) {
      const pointsEarned = 30;

      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } });

      await PointsLog.create({
        userId,
        points: pointsEarned,
        reason: 'recurring_saving_streak',
        description: `Earned ${pointsEarned} points for maintaining recurring saving streak`,
        relatedModel: 'Goal'
      });

      console.log(`Awarded ${pointsEarned} points to user ${userId} for recurring saving streak`);
    }
  } catch (error) {
    console.error('Award recurring saving points error:', error);
  }
};

// ================================
// Award Points for Debt Payment
// ================================
exports.awardDebtPaymentPoints = async (userId, debtId, paymentAmount) => {
  try {
    const debt = await Debt.findById(debtId);

    if (!debt || debt.userId.toString() !== userId.toString()) {
      return;
    }

    // Award points based on payment amount (10 points per 1000 INR)
    const pointsEarned = Math.floor(paymentAmount / 1000) * 10;

    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } });

      await PointsLog.create({
        userId,
        points: pointsEarned,
        reason: 'debt_paid_off',
        description: `Earned ${pointsEarned} points for paying off debt: ${debt.title}`,
        relatedId: debtId,
        relatedModel: 'Debt'
      });

      console.log(`Awarded ${pointsEarned} points to user ${userId} for debt payment`);
    }
  } catch (error) {
    console.error('Award debt payment points error:', error);
  }
};

// ================================
// Get User Achievements
// ================================
exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = {
      budgetMaster: {
        title: 'Budget Master',
        description: 'Stay under budget for 3 consecutive months',
        icon: '🎯',
        earned: false
      },
      goalCrusher: {
        title: 'Goal Crusher',
        description: 'Complete 5 saving goals',
        icon: '🏆',
        earned: false
      },
      debtDestroyer: {
        title: 'Debt Destroyer',
        description: 'Pay off 3 debts completely',
        icon: '💪',
        earned: false
      },
      consistentSaver: {
        title: 'Consistent Saver',
        description: 'Maintain saving streak for 6 months',
        icon: '📈',
        earned: false
      },
      financialGuru: {
        title: 'Financial Guru',
        description: 'Reach 1000 total points',
        icon: '🧠',
        earned: false
      }
    };

    // Check Budget Master
    const budgetAchievements = await PointsLog.find({
      userId,
      reason: 'budget_under_limit'
    }).countDocuments();

    achievements.budgetMaster.earned = budgetAchievements >= 3;

    // Check Goal Crusher
    const completedGoals = await Goal.find({
      userId,
      status: 'completed'
    }).countDocuments();

    achievements.goalCrusher.earned = completedGoals >= 5;

    // Check Debt Destroyer
    const closedDebts = await Debt.find({
      userId,
      status: 'closed'
    }).countDocuments();

    achievements.debtDestroyer.earned = closedDebts >= 3;

    // Check Consistent Saver
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentSavingLogs = await PointsLog.find({
      userId,
      reason: 'recurring_saving_streak',
      createdAt: { $gte: sixMonthsAgo }
    }).countDocuments();

    achievements.consistentSaver.earned = recentSavingLogs >= 6;

    // Check Financial Guru
    const user = await User.findById(userId);
    achievements.financialGuru.earned = user.points >= 1000;

    res.json({
      status: 'success',
      data: achievements
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user achievements'
    });
  }
};

// ================================
// Admin: Get All Users Points (Future Admin Feature)
// ================================
exports.getAllUsersPoints = async (req, res) => {
  try {
    // This would be for admin users only
    const users = await User.find({})
      .select('name email points createdAt')
      .sort({ points: -1 });

    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Get all users points error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users points'
    });
  }
};
