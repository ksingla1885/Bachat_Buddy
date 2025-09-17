const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../utils/authMiddleware');

router.use(protect); // All transaction routes are protected

router.route('/')
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction);

router.route('/:id')
  .get(transactionController.getTransaction)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
