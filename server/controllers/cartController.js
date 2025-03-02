const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.product',
                select: 'name price images'
            });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
                totalAmount: 0
            });
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
                totalAmount: 0
            });
        }

        // Check if product already exists in cart with same size
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                size
            });
        }

        // Recalculate total amount
        await cart.populate('items.product');
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.id(req.params.itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Validate stock
        const product = await Product.findById(cartItem.product);
        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (product.price * item.quantity);
        }, 0);

        await cart.save();
        await cart.populate('items.product', 'name price images');
        
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item._id.toString() !== req.params.itemId
        );

        // Recalculate total amount
        await cart.populate('items.product');
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
}; 