const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('orchids');
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
