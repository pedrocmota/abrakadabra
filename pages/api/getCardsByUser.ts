import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema, CardsSchema} from '../../models/Schemas'

interface IGetCardsByUserRequest {
  userID: string
}

export default async (req: ExtendedNextApiRequest<IGetCardsByUserRequest>, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (requireParams(req, {
      query: {
        userID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const usersSchema = await UsersSchema()
        const cardsSchema = await CardsSchema()

        const allUsers = await usersSchema.find().toArray()
        const cards = (await cardsSchema.find({
          user: req.query.userID
        }, {
          sort: {datetime: 1}
        }).toArray()).map(doc => {
          return ({
            ...doc,
            _id: doc._id.toString(),
            userName: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido'
          })
        })
        return res.json(cards)
      } else {
        return res.status(401).end()
      }
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}