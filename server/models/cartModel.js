const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: {
        type: String,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart; 
 