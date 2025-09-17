const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const emailService = require('../utils/emailService');

// Create budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, year, alertThreshold } = req.body;

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category,
      month,
      year
    });

    if (existingBudget) {
      return res.status(400).json({
        status: 'error',
        message: 'Budget already exists for this category and month'
      });
    }

    // Calculate current spent amount for this category and month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const spent = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.id,
          category,
          type: 'Expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month,
      year,
      alertThreshold: alertThreshold || 0.8,
      spent: spent[0]?.total || 0
    });

    res.status(201).json({
      status: 'success',
      data: { budget }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating budget',
      error: error.message
    });
  }
};

// Get all budgets for user
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const query = { userId: req.user.id };
    if (month) query.month = month;
    if (year) query.year = year;

    const budgets = await Budget.find(query);

    res.status(200).json({
      status: 'success',
      data: { budgets }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching budgets',
      error: error.message
    });
  }
};

// Get single budget
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { budget }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching budget',
      error: error.message
    });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    const { amount, alertThreshold } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { amount, alertThreshold },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    // Check if current spending exceeds new threshold
    if (budget.spent >= amount * alertThreshold) {
      await emailService.sendBudgetAlert(req.user.email, {
        category: budget.category,
        budgetAmount: amount,
        spentAmount: budget.spent,
        threshold: alertThreshold * 100
      });
    }

    res.status(200).json({
      status: 'success',
      data: { budget }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating budget',
      error: error.message
    });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting budget',
      error: error.message
    });
  }
};

// Get budget summary
exports.getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({
        status: 'error',
        message: 'Month and year are required'
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const budgets = await Budget.find({
      userId: req.user.id,
      month,
      year
    });

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.id,
          month: req.query.month,
          year: req.query.year,
          type: "Expense"
        }
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: { $toDouble: "$amount" } } // <-- force numeric sum
        }
      }
    ]);

    const result = budgets.map(budget => {
      const categorySpent = Number(summary.find(t => t._id === budget.category)?.spent || 0);
      // Parse numbers using parseFloat for more precise calculations
      const budgetedAmount = parseFloat(budget.amount) || 0;
      const spentAmount = parseFloat(categorySpent) || 0;
      
      // Calculate remaining and percentage
      const remaining = parseFloat((budgetedAmount - spentAmount).toFixed(2));
      let percentage = 0;
      
      if (budgetedAmount > 0) {
        percentage = Math.min(Math.round((spentAmount / budgetedAmount) * 100), 100);
      }

      return {
        category: budget.category,
        budgeted: parseFloat(budgetedAmount.toFixed(2)),
        spent: parseFloat(spentAmount.toFixed(2)),
        remaining: remaining,
        percentage: percentage // Now capped at 100%
      };
    });

    res.status(200).json({
      status: 'success',
      data: { summary: result }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching budget summary',
      error: error.message
    });
  }
};
