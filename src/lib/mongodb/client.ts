import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'orchids'

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
}

function createMongoClientPromise() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  const client = new MongoClient(uri)
  return client.connect()
}

export function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global.__mongoClientPromise) {
      global.__mongoClientPromise = createMongoClientPromise()
    }
    return global.__mongoClientPromise
  }

  return createMongoClientPromise()
}

export async function getDb() {
  const client = await getMongoClient()
  return client.db(dbName)
}
