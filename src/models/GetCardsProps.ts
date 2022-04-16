import {UsersSchema, CardsSchema, IProfileData} from './Schemas'
import {toID, sanitizeID} from '../utils/database'

export interface ICardsProps extends IProfileData {
  cardsLimit: number,
  cardsAmount: number,
  users: {
    _id: string,
    name: string
  }[]
}

export const getCardsProps = async (userID: string): Promise<ICardsProps | undefined> => {
  const usersSchema = await UsersSchema()
  const cardsSchema = await CardsSchema()
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
    const cardsAmount = await cardsSchema.countDocuments()
    return {
      name: user.name.split(' ')[0],
      fullname: user.name,
      isAdmin: user.admin,
      cardsAmount: cardsAmount,
      cardsLimit: parseInt(process.env.CARD_LIMIT),
      users: sanitizeID(allUsers)
    }
  } else {
    return undefined
  }
}