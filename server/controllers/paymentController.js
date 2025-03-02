const Order = require('../models/orderModel');
const zenopay = require('../config/zenopay');
const axios = require('axios');
const crypto = require('crypto');

const generateZenoPaySignature = (payload, timestamp) => {
    const message = `${payload}${timestamp}${zenopay.secretKey}`;
    return crypto.createHash('sha256').update(message).digest('hex');
};

const createZenoPayOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const timestamp = new Date().toISOString();
        const payload = {
            merchantId: zenopay.merchantId,
            merchantOrderId: order._id.toString(),
            amount: order.totalPrice,
            currency: 'TZS',
            customerEmail: order.user.email,
            customerPhone: order.user.phone,
            customerName: order.user.name,
            callbackUrl: `${process.env.BASE_URL}/api/payments/zenopay/callback`,
            returnUrl: `${process.env.CLIENT_URL}/order/${order._id}`,
            description: `Order payment for #${order._id}`
        };

        const signature = generateZenoPaySignature(JSON.stringify(payload), timestamp);

        const response = await axios.post(
            `${zenopay.baseUrl}/payments/create`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${zenopay.apiKey}`,
                    'X-Signature': signature,
                    'X-Timestamp': timestamp
                }
            }
        );

        res.json({
            paymentUrl: response.data.paymentUrl,
            paymentId: response.data.paymentId
        });

    } catch (error) {
        console.error('ZenoPay payment error:', error);
        res.status(500).json({ 
            message: 'Payment creation failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const handleZenoPayCallback = async (req, res) => {
    try {
        const { 
            merchantOrderId, 
            paymentId, 
            status, 
            transactionId 
        } = req.body;

        // Verify signature
        const signature = req.headers['x-signature'];
        const timestamp = req.headers['x-timestamp'];
        const calculatedSignature = generateZenoPaySignature(JSON.stringify(req.body), timestamp);

        if (signature !== calculatedSignature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const order = await Order.findById(merchantOrderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status === 'COMPLETED') {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: paymentId,
                status: status,
                update_time: new Date().toISOString(),
                payment_method: 'ZenoPay',
                transaction_id: transactionId
            };
            await order.save();
        }

        res.json({ message: 'Callback processed successfully' });

    } catch (error) {
        console.error('ZenoPay callback error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createZenoPayOrder,
    handleZenoPayCallback
}; 