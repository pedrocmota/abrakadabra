import {UsersSchema, IProfileData} from './Schemas'
import {toID, sanitizeID} from '../utils/database'

export interface IAccessesProps extends IProfileData {
  users: {
    _id: string,
    name: string
  }[]
}

export const getAccessesProps = async (userID: string): Promise<IAccessesProps | undefined> => {
  const usersSchema = await UsersSchema()
  const user = await usersSchema.findOne({
    _id: toID(userID)
  })
  if (user) {
    const allUsers = (await usersSchema.find({}, {
      projection: {
        _id: 1,
        name: 1
      }
    }).toArray())
    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      users: sanitizeID(allUsers)
    }
  } else {
    return undefined
  }
}