const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../server/models/orderModel');
const User = require('../server/models/userModel');

dotenv.config({ path: './.env' });

async function run(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    const u = await User.findOne({ email: 'test@example.com' });
    if(!u){
      console.error('User not found');
      process.exit(1);
    }
  // Ensure test user has a Tanzanian phone number for FastLipa
  u.phone = '0695123456';
  await u.save();
  const order = await Order.create({ user: u._id, orderItems: [], shippingAddress: { address: '123 Test', city: 'Test City', postalCode: '00000', country: 'Testland' }, paymentMethod: 'fastlipa', totalPrice: 5000 });
    console.log('Created order', order._id.toString());
    await mongoose.disconnect();
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

run();
