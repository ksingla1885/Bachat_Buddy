const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Debt = require('../models/Debt');
const mongoose = require('mongoose');

// ================================
// Export Transactions CSV
// ================================
exports.exportTransactionsCSV = async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;

    let filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter)
      .populate('walletId', 'name type')
      .sort({ date: -1 });

    // Convert to CSV format
    const csvHeader = 'Date,Type,Amount,Category,Wallet,Description,Notes\n';
    const csvData = transactions.map(transaction => {
      const date = transaction.date.toISOString().split('T')[0];
      const type = transaction.type;
      const amount = transaction.amount;
      const category = transaction.category || 'N/A';
      const wallet = transaction.walletId ? transaction.walletId.name : 'N/A';
      const description = transaction.description || 'N/A';
      const notes = transaction.notes || 'N/A';

      return `"${date}","${type}","${amount}","${category}","${wallet}","${description}","${notes}"`;
    }).join('\n');

    const csvContent = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export transactions CSV error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export transactions CSV'
    });
  }
};

// ================================
// Export Comprehensive Report CSV
// ================================
exports.exportComprehensiveCSV = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user data
    const [transactions, wallets, budgets, goals, debts] = await Promise.all([
      Transaction.find({ userId }).populate('walletId', 'name type').sort({ date: -1 }),
      Wallet.find({ userId }),
      Budget.find({ userId }).sort({ month: -1 }),
      Goal.find({ userId }),
      Debt.find({ userId })
    ]);

    // Create comprehensive CSV
    let csvContent = '';

    // Transactions section
    csvContent += '=== TRANSACTIONS ===\n';
    csvContent += 'Date,Type,Amount,Category,Wallet,Notes\n';
    transactions.forEach(transaction => {
      csvContent += `"${transaction.date.toISOString().split('T')[0]}","${transaction.type}","${transaction.amount}","${transaction.category || 'N/A'}","${transaction.walletId?.name || 'N/A'}","${transaction.notes || 'N/A'}"\n`;
    });

    csvContent += '\n=== WALLETS ===\n';
    csvContent += 'Name,Type,Balance,Currency\n';
    wallets.forEach(wallet => {
      csvContent += `"${wallet.name}","${wallet.type}","${wallet.balance}","${wallet.currency}"\n`;
    });

    csvContent += '\n=== BUDGETS ===\n';
    csvContent += 'Month,Category,Budgeted,Spent,Remaining\n';
    budgets.forEach(budget => {
      csvContent += `"${budget.month}","${budget.category}","${budget.budgetedAmount}","${budget.spentAmount}","${budget.remainingAmount}"\n`;
    });

    csvContent += '\n=== GOALS ===\n';
    csvContent += 'Title,Target Amount,Saved Amount,Remaining,Status,Deadline\n';
    goals.forEach(goal => {
      csvContent += `"${goal.title}","${goal.targetAmount}","${goal.savedAmount}","${goal.remainingAmount}","${goal.status}","${goal.deadline.toISOString().split('T')[0]}"\n`;
    });

    csvContent += '\n=== DEBTS ===\n';
    csvContent += 'Title,Type,Amount,Remaining,Interest Rate,Status,Due Date\n';
    debts.forEach(debt => {
      csvContent += `"${debt.title}","${debt.type}","${debt.amount}","${debt.remainingAmount}","${debt.interestRate || 'N/A'}","${debt.status}","${debt.dueDate.toISOString().split('T')[0]}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=comprehensive-report.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export comprehensive CSV error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export comprehensive CSV'
    });
  }
};

// ================================
// Export PDF Report
// ================================
exports.exportPDFReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const puppeteer = require('puppeteer');

    // Get user data
    const [transactions, wallets, budgets, goals, debts] = await Promise.all([
      Transaction.find({ userId }).populate('walletId', 'name type').limit(100),
      Wallet.find({ userId }),
      Budget.find({ userId }).limit(12),
      Goal.find({ userId }),
      Debt.find({ userId })
    ]);

    // Calculate summary statistics
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    const budgetUtilization = budgets.map(budget => ({
      ...budget.toObject(),
      utilizationPercentage: budget.budgetedAmount > 0 ? (budget.spentAmount / budget.budgetedAmount) * 100 : 0
    }));

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BachatBuddy Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { display: flex; justify-content: space-around; margin: 20px 0; }
          .summary-card { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
          .section { margin: 30px 0; }
          .section h2 { border-bottom: 2px solid #333; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .positive { color: green; }
          .negative { color: red; }
          .status-active { color: green; }
          .status-closed { color: gray; }
          .status-completed { color: blue; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BachatBuddy</h1>
          <h2>Personal Finance Report</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary">
          <div class="summary-card">
            <h3>Total Income</h3>
            <p class="positive">₹${totalIncome.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Total Expenses</h3>
            <p class="negative">₹${totalExpenses.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Net Balance</h3>
            <p class="${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}">
              ₹${(totalIncome - totalExpenses).toLocaleString()}
            </p>
          </div>
          <div class="summary-card">
            <h3>Wallet Balance</h3>
            <p>₹${totalWalletBalance.toLocaleString()}</p>
          </div>
        </div>

        <div class="section">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.slice(0, 20).map(t => `
                <tr>
                  <td>${t.date.toLocaleDateString()}</td>
                  <td>${t.type}</td>
                  <td class="${t.type === 'Income' ? 'positive' : 'negative'}">₹${t.amount.toLocaleString()}</td>
                  <td>${t.category || 'N/A'}</td>
                  <td>${t.walletId?.name || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Wallets</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${wallets.map(w => `
                <tr>
                  <td>${w.name}</td>
                  <td>${w.type}</td>
                  <td>₹${w.balance.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Budget Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Category</th>
                <th>Budgeted</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              ${budgetUtilization.map(b => `
                <tr>
                  <td>${b.month}</td>
                  <td>${b.category}</td>
                  <td>₹${b.budgetedAmount.toLocaleString()}</td>
                  <td>₹${b.spentAmount.toLocaleString()}</td>
                  <td class="${b.remainingAmount >= 0 ? 'positive' : 'negative'}">₹${b.remainingAmount.toLocaleString()}</td>
                  <td>${b.utilizationPercentage.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Saving Goals</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Target</th>
                <th>Saved</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${goals.map(g => `
                <tr>
                  <td>${g.title}</td>
                  <td>₹${g.targetAmount.toLocaleString()}</td>
                  <td>₹${g.savedAmount.toLocaleString()}</td>
                  <td>₹${g.remainingAmount.toLocaleString()}</td>
                  <td class="status-${g.status}">${g.status}</td>
                  <td>${g.deadline.toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Debts</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Remaining</th>
                <th>Interest Rate</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${debts.map(d => `
                <tr>
                  <td>${d.title}</td>
                  <td>${d.type}</td>
                  <td>₹${d.amount.toLocaleString()}</td>
                  <td>₹${d.remainingAmount.toLocaleString()}</td>
                  <td>${d.interestRate ? d.interestRate + '%' : 'N/A'}</td>
                  <td class="status-${d.status}">${d.status}</td>
                  <td>${d.dueDate.toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=financial-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export PDF report'
    });
  }
};

// ================================
// Get Report Summary
// ================================
exports.getReportSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [transactionStats, walletStats, budgetStats, goalStats, debtStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),
      Wallet.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$type',
            totalBalance: { $sum: '$balance' },
            count: { $sum: 1 }
          }
        }
      ]),
      Budget.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalBudgeted: { $sum: '$budgetedAmount' },
            totalSpent: { $sum: '$spentAmount' },
            totalRemaining: { $sum: '$remainingAmount' }
          }
        }
      ]),
      Goal.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalTarget: { $sum: '$targetAmount' },
            totalSaved: { $sum: '$savedAmount' }
          }
        }
      ]),
      Debt.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalRemaining: { $sum: '$remainingAmount' }
          }
        }
      ])
    ]);

    res.json({
      status: 'success',
      data: {
        transactions: transactionStats,
        wallets: walletStats,
        budgets: budgetStats[0] || { totalBudgeted: 0, totalSpent: 0, totalRemaining: 0 },
        goals: goalStats,
        debts: debtStats
      }
    });
  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch report summary'
    });
  }
};
