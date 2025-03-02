const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createZenoPayOrder,
    handleZenoPayCallback
} = require('../controllers/paymentController');

router.post('/zenopay/:orderId', protect, createZenoPayOrder);
router.post('/zenopay/callback', handleZenoPayCallback);

module.exports = router; 