const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

async function createTestUsers() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('orchids');
  
  const hashedPassword = await bcrypt.hash('test123', 10);
  const users = [
    { role: 'hod', email: 'testhod@mitsgwalior.in', full_name: 'Test HOD' },
    { role: 'timetable_coordinator', email: 'testcoordinator@mitsgwalior.in', full_name: 'Test Coordinator', is_coordinator: true },
    { role: 'faculty', email: 'testfaculty@mitsgwalior.in', full_name: 'Test Faculty' },
  ];
  
  for (const user of users) {
    const existing = await db.collection('users').findOne({ email: user.email });
    if (!existing) {
      await db.collection('users').insertOne({
        id: crypto.randomUUID(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_coordinator: user.is_coordinator || false,
        password: hashedPassword,
        created_at: new Date().toISOString(),
      });
      console.log('Created:', user.email);
    } else {
      console.log('Already exists:', user.email);
    }
  }
  
  await client.close();
  console.log('Done!');
}

createTestUsers().catch(console.error);
