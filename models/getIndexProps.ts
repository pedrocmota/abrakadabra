import {ObjectId} from 'mongodb'
import {UsersSchema, CardsSchema, AccessesSchema, MachinesSchema} from './Schemas'

export const getIndexProps = async (userID: string) => {
  const usersSchema = await UsersSchema()
  const cardsSchema = await CardsSchema()
  const accessesSchema = await AccessesSchema()
  const machinesSchema = await MachinesSchema()

  const allUsers = await usersSchema.find().toArray()
  const allMachines = await machinesSchema.find().toArray()
  const user = await usersSchema.findOne({
    _id: new ObjectId(userID) as any
  })
  if (user) {
    const cards = (await cardsSchema.find({
      user: user._id.toString() || ''
    }).toArray()).map(doc => {
      return ({
        ...doc,
        _id: doc._id.toString(),
        user: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido'
      })
    })
    const accesses = (await accessesSchema.find({
      user: user._id.toString() || ''
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