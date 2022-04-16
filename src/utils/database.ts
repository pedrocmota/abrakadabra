import {MongoClient, Db, ObjectId} from 'mongodb'

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

export const toID = (id: string) => {
  try {
    return new ObjectId(id) as any
  } catch {
    return ''
  }
}

export const sanitizeID = (obj: any[]) => {
  return obj.map((doc) => {
    return ({
      ...doc,
      _id: doc?._id?.toString()
    })
  })
}