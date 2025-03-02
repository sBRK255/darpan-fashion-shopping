const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats
}; 