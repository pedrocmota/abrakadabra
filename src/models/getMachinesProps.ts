import {UsersSchema, MachinesSchema, IProfileData, IMachines} from './Schemas'
import {toID} from '../utils/database'

export interface IMachinesProps extends IProfileData {
  machines: IMachines[]
}

export const getMachinesProps = async (userID: string) => {
  const usersSchema = await UsersSchema()
  const machinesSchema = await MachinesSchema()

  const allMachines = (await machinesSchema.find().toArray()).map((doc) => {
    return ({
      ...doc,
      _id: doc._id.toString()
    })
  })
  const user = await usersSchema.findOne({
    _id: toID(userID)
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