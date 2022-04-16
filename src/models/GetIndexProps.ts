import {UsersSchema, CardsSchema, AccessesSchema, MachinesSchema, IProfileData, ICards, IAccess} from './Schemas'
import {toID} from '../utils/database'

export interface IIndex extends IProfileData {
  cards: ICards[],
  accesses: IAccess[]
}

export const getIndexProps = async (userID: string): Promise<IIndex | undefined> => {
  const usersSchema = await UsersSchema()
  const cardsSchema = await CardsSchema()
  const accessesSchema = await AccessesSchema()
  const machinesSchema = await MachinesSchema()

  const allUsers = await usersSchema.find().toArray()
  const allMachines = await machinesSchema.find().toArray()
  const user = await usersSchema.findOne({
    _id: toID(userID)
  })
  if (user) {
    const cards = (await cardsSchema.find({
      user: user._id.toString()
    }).toArray()).map(doc => {
      return ({
        ...doc,
        _id: doc._id.toString(),
        user: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido'
      })
    })
    const accesses = (await accessesSchema.find({
      user: user._id.toString()
    }, {
      sort: {datetime: 1},
      limit: 50
    }).toArray()).map(doc => {
      return ({
        ...doc,
        _id: doc._id.toString(),
        user: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido',
        place: allMachines.find(e => e._id.toString() === doc.place)?.alias || 'Desconhecido'
      })
    })

    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      cards: cards,
      accesses: accesses
    }
  }
}