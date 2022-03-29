import type {NextApiResponse} from 'next'
import {ObjectId} from 'mongodb'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

interface IChangePINRequest {
  pin: string
}

export default async (req: ExtendedNextApiRequest<IChangePINRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        pin: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, false)
      if (session) {
        if (req.body.pin.length === 8 && !isNaN(req.body.pin as any)) {
          const usersSchema = await UsersSchema()
          await usersSchema.updateOne({
            _id: new ObjectId(session.userID) as any
          }, {
            $set: {
              pin: parseInt(req.body.pin)
            }
          })
          return res.status(200).end()
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