const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../utils/authMiddleware');

// All report routes are protected
router.use(protect);

// CSV Export routes
router.get('/csv/transactions', reportController.exportTransactionsCSV);
router.get('/csv/comprehensive', reportController.exportComprehensiveCSV);

// PDF Export route
router.get('/pdf/comprehensive', reportController.exportPDFReport);

// Report summary
router.get('/summary', reportController.getReportSummary);

module.exports = router;
