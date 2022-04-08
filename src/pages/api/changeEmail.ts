import type {NextApiResponse} from 'next'
import {ObjectId} from 'mongodb'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

interface IChangeEmailRequest {
  email: string
}

export default async (req: ExtendedNextApiRequest<IChangeEmailRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        email: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, false)
      if (session) {
        const usersSchema = await UsersSchema()
        const emailAlredyUsed = await usersSchema.findOne({
          email: req.body.email
        })
        if (emailAlredyUsed === null) {
          await usersSchema.updateOne({
            _id: new ObjectId(session.userID) as any
          }, {
            $set: {
              email: req.body.email
            }
          })
          return res.status(200).end()
        } else {
          return res.status(409).end()
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