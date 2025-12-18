const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('orchids');
    
    const email = 'student@example.com';
    const password = 'password123';
    const hashed = await bcrypt.hash(password, 10);
    const id = new ObjectId().toHexString();

    const user = {
      id,
      email,
      full_name: 'Student User',
      role: 'student',
      password: hashed,
      created_at: new Date().toISOString(),
    };

    // Delete existing student if any to avoid duplicates
    await db.collection('users').deleteOne({ email });

    const result = await db.collection('users').insertOne(user);
    console.log(`Student user created with id: ${result.insertedId}`);
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
