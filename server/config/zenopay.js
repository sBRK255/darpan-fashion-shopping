const zenopay = {
    apiKey: process.env.ZENOPAY_API_KEY,
    secretKey: process.env.ZENOPAY_SECRET_KEY,
    merchantId: process.env.ZENOPAY_MERCHANT_ID,
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://api.zenopay.co.tz/v1'
        : 'https://sandbox.zenopay.co.tz/v1'
};

module.exports = zenopay; 