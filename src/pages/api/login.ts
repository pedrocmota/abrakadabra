import type {NextApiResponse} from 'next'
import bycript from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import Cookies from 'cookies'
import {ExtendedNextApiRequest, ISession, requireParams} from '../../utils/request'
import {UsersSchema} from '../../models/Schemas'

interface ILoginRequest {
  email: string,
  password: string
}

export default async (req: ExtendedNextApiRequest<ILoginRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        email: 'string',
        password: 'string'
      }
    })) {
      const usersSchema = await UsersSchema()
      const user = await usersSchema.findOne({
        email: req.body.email
      })
      if (user && bycript.compareSync(req.body.password, user.password)) {
        const token = jsonwebtoken.sign({
          userID: user._id,
          isAdmin: user.admin
        } as ISession, process.env.JWT_KEY, {
          expiresIn: parseInt(process.env.JWT_TIMEOUT)
        })
        const cookies = new Cookies(req, res)
        cookies.set('session', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: parseInt(process.env.JWT_TIMEOUT) * 1000
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