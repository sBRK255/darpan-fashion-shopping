const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['jerseys', 't-shirts', 'shoes', 'sandals']
    },
    images: [{
        type: String,
        required: true
    }],
    sizes: [{
        type: String,
        required: true
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 