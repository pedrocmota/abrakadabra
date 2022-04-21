import type {NextApiResponse} from 'next'
import bcrypt from 'bcrypt'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

interface ICreateUserRequest {
  name: string,
  email: string,
  password: string,
  isAdmin: string
}

export default async (req: ExtendedNextApiRequest<ICreateUserRequest>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      name: 'string',
      email: 'string',
      password: 'string',
      isAdmin: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (session) {
    const usersSchema = await UsersSchema()
    if (req.body.name.length > 3
      && req.body.name.length < 30
      && req.body.password.length >= 6
      && req.body.password.length < 30) {
      const emailAlredyUsed = await usersSchema.findOne({
        email: req.body.email
      })
      if (emailAlredyUsed === null) {
        usersSchema.insertOne({
          name: req.body.name,
          email: req.body.email,
          admin: (req.body.isAdmin === 'true'),
          password: bcrypt.hashSync(req.body.password, 12)
        })
        return res.status(200).end()
      } else {
        return res.status(409).end()
      }
    } else {
      return res.status(400).end()
    }
  } else {
    return res.status(401).end()
  }
}