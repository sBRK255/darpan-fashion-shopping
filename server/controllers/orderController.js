const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { 
            shippingAddress, 
            paymentMethod 
        } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        // Create order items from cart
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images[0]
        }));

        // Create order
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice: cart.totalAmount
        });

        if (order) {
            // Update product quantities
            for (const item of cart.items) {
                const product = await Product.findById(item.product._id);
                product.quantity -= item.quantity;
                await product.save();
            }

            // Clear cart
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();

            res.status(201).json(order);
        } else {
            res.status(400).json({ message: 'Error creating order' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
}; 