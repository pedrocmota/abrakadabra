import {MongoClient, Db} from 'mongodb'

let cachedDb: Db = null as any

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(process.env.MONGO_URI as string)
  const db = client.db('abrakadabra')
  cachedDb = db
  return db
}