import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import Randomstring from 'randomstring'
import {sendEmail} from '../../models/NodeMailer'
import {UsersSchema, RecoveryCodesSchema} from '../../models/Schemas'


interface ISendRecoveryEmailRequest {
  email: string
}

export default async (req: ExtendedNextApiRequest<ISendRecoveryEmailRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        email: 'string'
      }
    })) {
      const usersSchema = await UsersSchema()
      const recoveryCodesSchema = await RecoveryCodesSchema()
      const account = await usersSchema.findOne({
        email: req.body.email
      })
      if (account) {
        const code = Randomstring.generate({
          length: 8,
          charset: 'alphanumeric'
        })
        await recoveryCodesSchema.createIndex({'expiresAt': 1}, {expireAfterSeconds: 300})
        await recoveryCodesSchema.insertOne({
          userID: account._id.toString(),
          code: code,
          expiresAt: new Date()
        })
        sendEmail(req.body.email, code)
      }
      res.status(200).end()
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}