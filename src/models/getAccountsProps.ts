import {ObjectId} from 'mongodb'
import {UsersSchema} from './Schemas'

export const getAccountsProps = async (userID: string) => {
  const usersSchema = await UsersSchema()

  const user = await usersSchema.findOne({
    _id: new ObjectId(userID) as any
  })
  const allAccounts = (await usersSchema.find().toArray()).map(doc => {
    return ({
      ...doc,
      _id: doc._id.toString()
    })
  })
  if (user) {
    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      accounts: allAccounts
    }
  }
}