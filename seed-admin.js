const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const uri = 'mongodb+srv://Varun04:Varun%402005@sats1.dgzugvh.mongodb.net/?appName=SATS1';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('orchids');
    
    const email = 'admin@example.com';
    const password = 'password123';
    const hashed = await bcrypt.hash(password, 10);
    const id = new ObjectId().toHexString();

    const user = {
      id,
      email,
      full_name: 'Admin User',
      role: 'admin',
      password: hashed,
      created_at: new Date().toISOString(),
    };

    const result = await db.collection('users').insertOne(user);
    console.log(`User created with id: ${result.insertedId}`);
    console.log(`Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
