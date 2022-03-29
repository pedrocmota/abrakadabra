import type {NextApiRequest, NextApiResponse} from 'next'
import {requireSession} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const session = requireSession(req.cookies.session, true)
    if (session) {
      const usersSchema = await UsersSchema()

      const allAccounts = (await usersSchema.find().toArray()).map(doc => {
        //@ts-ignore
        delete doc.email
        //@ts-ignore
        delete doc.password
        delete doc.pin
        return ({
          ...doc,
          _id: doc._id.toString()
        })
      })

      return res.json(allAccounts)
    } else {
      return res.status(401).end()
    }
  } else {
    return res.status(405).end()
  }
}