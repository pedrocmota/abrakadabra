import {connectToDatabase} from '../utils/database'

export interface IProfileData {
  name: string,
  fullname: string,
  isAdmin: boolean
}

export interface IUsers {
  _id?: string,
  email: string,
  password: string,
  name: string,
  admin: boolean
}

export interface ICards {
  _id?: string,
  code: string,
  alias: string,
  uuid?: string,
  status: number,
  user: string
}

export interface IAccess {
  _id?: string,
  datetime: number,
  user: string,
  userName?: string,
  place: string
}

export interface IMachines {
  _id?: string,
  alias: string,
  token: string
}

export const UsersSchema = async () => {
  const db = await connectToDatabase()
  return db.collection<IUsers>('users')
}

export const AccessesSchema = async () => {
  const db = await connectToDatabase()
  return db.collection<IAccess>('accesses')
}

export const CardsSchema = async () => {
  const db = await connectToDatabase()
  return db.collection<ICards>('cards')
}

export const MachinesSchema = async () => {
  const db = await connectToDatabase()
  return db.collection<IMachines>('machines')
}