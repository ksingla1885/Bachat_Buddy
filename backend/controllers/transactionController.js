const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Budget = require('../models/Budget');
const { categorizeTransaction, suggestTags } = require('../utils/categoryTagger');
const emailService = require('../utils/emailService');
const mongoose = require('mongoose');

// ===============================
// Create Transaction
// ===============================
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, walletId, toWallet, category, notes, date } = req.body;
    const numericAmount = Number(amount);

    // Base transaction data without category
    const transactionData = {
      userId: req.user.id,
      type,
      amount: numericAmount,
      walletId,
      date: date || new Date(),
      notes,
      currency: 'INR'
    };

    // Add category only for Income/Expense
    if (type !== 'Transfer') {
      if (!category) {
        return res.status(400).json({
          status: 'error',
          message: 'Category is required for Income/Expense transactions'
        });
      }
      transactionData.category = category;
    }

    // For transfers, add toWallet
    
    if (type === 'Transfer') {
      if (!toWallet) {
        return res.status(400).json({
          status: 'error',
          message: 'Destination wallet is required for transfers'
        });
      }
      transactionData.toWallet = toWallet;
    }

    // Create transaction
    const transaction = await Transaction.create(transactionData);

    // Update wallet balance(s)
    if (type === 'Transfer') {
      const [fromWallet, toWalletDoc] = await Promise.all([
        Wallet.findById(walletId),
        Wallet.findById(toWallet)
      ]);

      fromWallet.currentBalance = Number(fromWallet.currentBalance) - numericAmount;
      toWalletDoc.currentBalance = Number(toWalletDoc.currentBalance) + numericAmount;
      console.log("From Wallet New Balance:", fromWallet.currentBalance);

      await Promise.all([
        fromWallet.save(),
        toWalletDoc.save()
      ]);
    } else {
      const wallet = await Wallet.findById(walletId);
      wallet.currentBalance = Number(wallet.currentBalance) + 
        (type === 'Income' ? numericAmount : -numericAmount);
      await wallet.save();
    }

    res.status(201).json({
      status: 'success',
      data: { transaction }
    });

  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating transaction',
      error: error.message
    });
  }
};

// ===============================
// Get All Transactions
// ===============================
exports.getTransactions = async (req, res) => {
  try {
    const {
      walletId,
      category,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = { userId: req.user.id };

    if (walletId) query.walletId = walletId;
    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('walletId', 'name type');

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

// ===============================
// Get Single Transaction
// ===============================
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('walletId', 'name type');

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { transaction }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching transaction',
      error: error.message
    });
  }
};

// ===============================
// Update Transaction
// ===============================
exports.updateTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      merchant,
      notes,
      tags,
      date
    } = req.body;

    const oldTransaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!oldTransaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Revert old wallet balance
    const wallet = await Wallet.findById(oldTransaction.walletId);
    wallet.currentBalance -= oldTransaction.type === 'Income'
      ? oldTransaction.amount
      : -oldTransaction.amount;

    // Update transaction details
    oldTransaction.type = type || oldTransaction.type;
    oldTransaction.amount = amount || oldTransaction.amount;
    oldTransaction.category = category || oldTransaction.category;
    oldTransaction.merchant = merchant || oldTransaction.merchant;
    oldTransaction.notes = notes || oldTransaction.notes;
    oldTransaction.tags = tags || oldTransaction.tags;
    oldTransaction.date = date || oldTransaction.date;

    await oldTransaction.save();

    // Apply new wallet balance
    wallet.currentBalance += oldTransaction.type === 'Income'
      ? oldTransaction.amount
      : -oldTransaction.amount;
    await wallet.save();

    res.status(200).json({
      status: 'success',
      data: { transaction: oldTransaction }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating transaction',
      error: error.message
    });
  }
};

// ===============================
// Delete Transaction
// ===============================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction ID'
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Update wallet balance
    try {
      const wallet = await Wallet.findById(transaction.walletId);
      if (wallet) {
        wallet.currentBalance -= transaction.type === 'Income'
          ? transaction.amount
          : -transaction.amount;
        await wallet.save();
      } else {
        console.warn(`Wallet not found for transaction ${transaction._id}`);
      }
    } catch (walletError) {
      console.error('Error updating wallet during transaction delete:', walletError);
    }

    // ❌ OLD: await transaction.remove();  <-- DEPRECATED
    // ✅ NEW FIX:
    await transaction.deleteOne(); // safer in Mongoose 7+

    res.status(200).json({
      status: 'success',
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting transaction',
      error: error.message
    });
  }
};