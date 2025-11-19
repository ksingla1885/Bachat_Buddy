const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debugController');

// GET /api/debug/send-test-email?to=you@example.com
router.get('/send-test-email', debugController.sendTestEmail);
// GET /api/debug/verify-smtp
router.get('/verify-smtp', debugController.verifySmtp);

module.exports = router;
