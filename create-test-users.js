const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createTestUsers() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('orchids');
  
  // Hash password
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  // Test Student
  const studentExists = await db.collection('users').findOne({ email: 'teststudent@mitsgwl.ac.in' });
  if (!studentExists) {
    await db.collection('users').insertOne({
      id: 'test-student-001',
      email: 'teststudent@mitsgwl.ac.in',
      full_name: 'Test Student',
      role: 'student',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    console.log('Created test student');
  } else {
    console.log('Test student already exists');
  }
  
  // Test Admin/Faculty
  const adminExists = await db.collection('users').findOne({ email: 'testadmin@mitsgwalior.in' });
  if (!adminExists) {
    await db.collection('users').insertOne({
      id: 'test-admin-001',
      email: 'testadmin@mitsgwalior.in',
      full_name: 'Test Admin',
      role: 'admin',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    console.log('Created test admin');
  } else {
    console.log('Test admin already exists');
  }
  
  await client.close();
  console.log('Done!');
}

createTestUsers().catch(console.error);
