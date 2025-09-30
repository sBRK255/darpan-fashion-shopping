const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createFastLipaOrder,
    getFastLipaTransactionStatus
} = require('../controllers/paymentController');

// Create a FastLipa transaction for an order
router.post('/fastlipa/:orderId', protect, createFastLipaOrder);

// Poll FastLipa transaction status
router.get('/fastlipa/status', getFastLipaTransactionStatus);

module.exports = router; 