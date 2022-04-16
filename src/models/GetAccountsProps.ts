import {UsersSchema, IProfileData, IUsers} from './Schemas'
import {toID, sanitizeID} from '../utils/database'

export interface IAccountsProps extends IProfileData {
  userID: string,
  isAdmin: boolean,
  users: IUsers[]
}

export const getAccountsProps = async (userID: string) => {
  const usersSchema = await UsersSchema()

  const user = await usersSchema.findOne({
    _id: toID(userID)
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
      users: sanitizeID(allAccounts)
    }
  }
}