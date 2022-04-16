import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {UsersSchema, AccessesSchema, CardsSchema} from '../../models/Schemas'

interface IDeleteUserRequest {
  userID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteUserRequest>, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    if (requireParams(req, {
      body: {
        userID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session && session.userID !== req.body.userID) {
        const usersSchema = await UsersSchema()
        const accessesSchema = await AccessesSchema()
        const cardsSchema = await CardsSchema()

        await usersSchema.deleteOne({
          _id: toID(req.body.userID)
        })
        await accessesSchema.deleteMany({
          user: req.body.userID
        })
        await cardsSchema.deleteMany({
          user: req.body.userID
        })
        return res.status(200).end()
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