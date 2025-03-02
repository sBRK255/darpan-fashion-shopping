const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

module.exports = router; 