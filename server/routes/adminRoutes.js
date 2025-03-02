const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);

module.exports = router; 