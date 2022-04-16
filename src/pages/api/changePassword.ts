import type {NextApiResponse} from 'next'
import {ObjectId} from 'mongodb'
import bycript from 'bcrypt'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

interface IChangePasswordRequest {
  password: string
}

export default async (req: ExtendedNextApiRequest<IChangePasswordRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        password: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, false)
      if (session) {
        if (req.body.password.length > 6 && req.body.password.length < 30) {
          const usersSchema = await UsersSchema()
          const hash = await bycript.hash(req.body.password, 12)
          await usersSchema.updateOne({
            _id: new ObjectId(session.userID) as any
          }, {
            $set: {
              password: hash
            }
          })
          return res.status(200).end()
        } else {
          return res.status(413).end()
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