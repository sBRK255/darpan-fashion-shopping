const pesapal = {
    consumerKey: process.env.PESAPAL_CONSUMER_KEY,
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
    callbackUrl: process.env.PESAPAL_CALLBACK_URL,
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://pay.pesapal.com/v3'
        : 'https://cybqa.pesapal.com/v3'
};

module.exports = pesapal; 