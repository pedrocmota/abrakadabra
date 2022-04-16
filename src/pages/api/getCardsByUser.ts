import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema, CardsSchema} from '../../models/Schemas'

interface IGetCardsByUserRequest {
  userID: string
}

export default async (req: ExtendedNextApiRequest<IGetCardsByUserRequest>, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    query: {
      userID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const usersSchema = await UsersSchema()
  const cardsSchema = await CardsSchema()
  const allUsers = await usersSchema.find().toArray()
  const cards = (await cardsSchema.find({}, {
    sort: {datetime: 1}
  }).toArray()).map(doc => {
    return ({
      ...doc,
      _id: doc._id.toString(),
      userName: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido'
    })
  })
  const cardsAmount = await cardsSchema.countDocuments()
  return res.json({
    inReadingMode: cards.some((card) => card.status === 3),
    cards: cards.filter((card) => card.user == req.query.userID),
    cardsAmount: cardsAmount
  })
}