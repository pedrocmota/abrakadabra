import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import bycript from 'bcrypt'
import {toID} from '../../utils/request'
import {UsersSchema, RecoveryCodesSchema} from '../../models/Schemas'

interface IRecoveryPasswordRequest {
  recoveryCode: string,
  password: string
}

export default async (req: ExtendedNextApiRequest<IRecoveryPasswordRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        recoveryCode: 'string',
        password: 'string'
      }
    })) {
      const usersSchema = await UsersSchema()
      const recoveryCodesSchema = await RecoveryCodesSchema()
      if (req.body.password.length > 6 && req.body.password.length < 30) {
        const recoveryCode = await recoveryCodesSchema.findOne({
          code: req.body.recoveryCode
        })
        if (recoveryCode) {
          await usersSchema.updateOne({
            _id: toID(recoveryCode.userID)
          }, {
            $set: {
              password: bycript.hashSync(req.body.password, 12)
            }
          })
          await recoveryCodesSchema.deleteOne({
            code: req.body.recoveryCode
          })
          return res.status(200).end()
        } else {
          return res.status(404).end()
        }
      } else {
        return res.status(413).end()
      }
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}