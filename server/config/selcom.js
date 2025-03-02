const selcom = {
    vendorId: process.env.SELCOM_VENDOR_ID,
    apiKey: process.env.SELCOM_API_KEY,
    apiSecret: process.env.SELCOM_API_SECRET,
    baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.selcom.co.tz/v1' 
        : 'https://api.selcom.co.tz/v1/sandbox'
};

module.exports = selcom; 