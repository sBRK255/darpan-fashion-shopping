const fastlipa = {
    apiToken: process.env.FASTLIPA_API_TOKEN,
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://api.fastlipa.com'
        : 'https://api.fastlipa.com' // FastLipa does not provide a sandbox URL in docs
};

module.exports = fastlipa;
