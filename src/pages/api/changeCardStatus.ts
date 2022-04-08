import type {NextApiResponse} from 'next'
import {ObjectId} from 'mongodb'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {UsersSchema, CardsSchema} from '../../models/Schemas'

interface IChangeCardStatusRequest {
  cardID: string,
  status: string
}

export default async (req: ExtendedNextApiRequest<IChangeCardStatusRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        cardID: 'string',
        status: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, false)
      if (session) {
        if (
          req.body.status === '0' ||
          req.body.status === '1' ||
          req.body.status === '2' ||
          req.body.status === '3') {
          const usersSchema = await UsersSchema()
          const cardsSchema = await CardsSchema()

          const card = await cardsSchema.findOne({
            _id: toID(req.body.cardID)
          })
          const user = await usersSchema.findOne({
            _id: toID(session.userID)
          })

          if (card && user) {
            if (card.user === user._id.toString() || user.admin) {
              await cardsSchema.updateOne({
                _id: new ObjectId(req.body.cardID) as any
              }, {
                $set: {
                  status: parseInt(req.body.status)
                }
              })
              return res.status(200).end()
            } else {
              return res.status(403).end()
            }
          } else {
            return res.status(400).end()
          }
        } else {
          return res.status(400).end()
        }
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