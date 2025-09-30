const Order = require('../models/orderModel');
const fastlipa = require('../config/fastlipa');
const axios = require('axios');

/**
 * Create a FastLipa transaction for the given order.
 * FastLipa expects: number (recipient phone), amount (smallest currency unit), name
 * We'll map the order to a FastLipa transaction and save the returned transaction id on the order.paymentResult
 */
const createFastLipaOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Helper to normalize phone to Tanzanian format expected by FastLipa
        const normalizePhone = (num) => {
            if (!num) return num;
            let s = String(num).trim();
            // remove spaces and plus
            s = s.replace(/\s+/g, '').replace(/^\+/, '');
            // if starts with 0 -> replace leading 0 with 255
            if (/^0/.test(s)) return '255' + s.slice(1);
            // if already starts with country code
            if (/^255/.test(s)) return s;
            // if short local format like 695123456 -> prepend 255
            if (/^[0-9]{9}$/.test(s)) return '255' + s;
            return s;
        };

        // Build payload according to FastLipa docs
        const data = {
            number: normalizePhone(order.user.phone),
            amount: Math.round(order.totalPrice), // ensure integer amount (smallest currency unit)
            name: order.user.name
        };

        let respData = {};

        // Always attempt to call FastLipa API; surface errors to caller
        console.log('FastLipa: calling API', `${fastlipa.baseUrl}/api/create-transaction`, 'with token present?', !!fastlipa.apiToken);
        try {
            const reqHeaders = {
                'Authorization': `Bearer ${fastlipa.apiToken}`,
                'Content-Type': 'application/json'
            };
            console.log('FastLipa outgoing request:', {
                url: `${fastlipa.baseUrl}/api/create-transaction`,
                headers: { Authorization: reqHeaders.Authorization },
                payload: data
            });

            const response = await axios.post(
                `${fastlipa.baseUrl}/api/create-transaction`,
                data,
                {
                    headers: reqHeaders,
                    timeout: 10000
                }
            );
            console.log('FastLipa API response status:', response.status);
            console.log('FastLipa API response data:', response.data);
            // Map response to expected shape. FastLipa returns { status, message, data: { tranID, ... } }
            const rd = response.data || {};
            if (rd && rd.data && (rd.data.tranID || rd.data.tranid)) {
                respData = {
                    tranid: rd.data.tranID || rd.data.tranid,
                    status: rd.data.status || rd.status || 'PENDING',
                    raw: rd
                };
            } else {
                respData = rd;
            }
        } catch (err) {
            console.error('FastLipa API call failed:', err.response ? err.response.data : err.message);
            return res.status(502).json({ message: 'FastLipa API call failed', error: err.response ? err.response.data : err.message });
        }

        // Save payment info on the order for later polling
        order.paymentResult = {
            id: respData.tranid || respData.transactionId || null,
            status: respData.status || 'PENDING',
            provider: 'FastLipa',
            raw: respData
        };

        await order.save();

        res.json({
            transactionId: order.paymentResult.id,
            status: order.paymentResult.status,
            raw: respData
        });

    } catch (error) {
        console.error('FastLipa payment error:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: 'Payment creation failed',
            error: process.env.NODE_ENV === 'development' ? (error.response ? error.response.data : error.message) : undefined
        });
    }
};

/**
 * Endpoint to poll FastLipa transaction status using tranid
 */
const getFastLipaTransactionStatus = async (req, res) => {
    try {
        const { tranid } = req.query;
        if (!tranid) {
            return res.status(400).json({ message: 'tranid query parameter is required' });
        }

        const token = fastlipa.apiToken && String(fastlipa.apiToken).trim();
        const isPlaceholder = !token || /^your[_-]?/i.test(token) || token.length === 0;
        if (isPlaceholder) {
            // Simulate status for local tranids created earlier
            if (tranid && tranid.startsWith('pay_local_')) {
                return res.json({ tranid, status: 'PENDING', note: 'Simulated status (no FASTLIPA token configured)' });
            }
            return res.status(400).json({ message: 'No FASTLIPA token configured to query status' });
        }

        const response = await axios.get(
            `${fastlipa.baseUrl}/api/status-transaction?tranid=${encodeURIComponent(tranid)}`,
            {
                headers: {
                    'Authorization': `Bearer ${fastlipa.apiToken}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('FastLipa status error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFastLipaOrder,
    getFastLipaTransactionStatus
};