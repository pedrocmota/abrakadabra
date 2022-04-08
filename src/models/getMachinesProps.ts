import {ObjectId} from 'mongodb'
import {UsersSchema, MachinesSchema} from './Schemas'

export const getMachinesProps = async (userID: string) => {
  const usersSchema = await UsersSchema()
  const machinesSchema = await MachinesSchema()

  const allMachines = (await machinesSchema.find().toArray()).map(doc => {
    return ({
      ...doc,
      _id: doc._id.toString()
    })
  })
  const user = await usersSchema.findOne({
    _id: new ObjectId(userID) as any
  })
  if (user) {
    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      machines: allMachines
    }
  }
}