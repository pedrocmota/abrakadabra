import {ObjectId} from 'mongodb'
import {UsersSchema} from './Schemas'

export const getUserProps = async (userID: string) => {
  const usersSchema = await UsersSchema()
  const user = await usersSchema.findOne({
    _id: new ObjectId(userID) as any
  })
  if (user) {
    const allUsers = (await usersSchema.find().toArray()).map(doc => {
      //@ts-ignore
      delete doc.email
      //@ts-ignore
      delete doc.password
      return ({
        ...doc,
        _id: doc._id.toString()
      })
    })
    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      users: allUsers
    }
  } else {
    return undefined
  }
}