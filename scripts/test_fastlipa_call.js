require('dotenv').config();
const axios = require('axios');
const fastlipa = require('../server/config/fastlipa');

const normalizePhone = (num) => {
    if (!num) return num;
    let s = String(num).trim();
    s = s.replace(/\s+/g, '').replace(/^\+/, '');
    if (/^0/.test(s)) return '255' + s.slice(1);
    if (/^255/.test(s)) return s;
    if (/^[0-9]{9}$/.test(s)) return '255' + s;
    return s;
};

(async () => {
    console.log('FastLipa token (masked):', fastlipa.apiToken ? fastlipa.apiToken.slice(0,6)+"..."+fastlipa.apiToken.slice(-4) : null);
    const data = {
        number: normalizePhone('+255695123456'),
        amount: 5000,
        name: 'Test User'
    };
    try {
        const resp = await axios.post(`${fastlipa.baseUrl}/api/create-transaction`, data, { headers: { 'Authorization': `Bearer ${fastlipa.apiToken}`, 'Content-Type': 'application/json' }, timeout: 15000 });
        console.log('HTTP', resp.status);
        console.log('Data', resp.data);
    } catch (err) {
        console.error('Error calling FastLipa:', err.response ? err.response.data : err.message);
    }
})();
