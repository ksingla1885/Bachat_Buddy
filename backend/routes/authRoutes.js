const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../utils/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);

module.exports = router;
