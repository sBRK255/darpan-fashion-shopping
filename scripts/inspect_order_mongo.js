const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

(async ()=>{
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const db = client.db();
    const order = await db.collection('orders').findOne({_id: new ObjectId('68dbde8c190a175eab0718f1')});
    console.log(JSON.stringify(order, null, 2));
  }catch(e){
    console.error(e);
  }finally{ await client.close(); }
})();
