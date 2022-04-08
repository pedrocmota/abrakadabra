import type {NextApiResponse} from 'next'
import randomstring from 'randomstring'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {MachinesSchema} from '../../models/Schemas'

interface ICreateMachineRequest {
  alias: string,
  userID: string
}

export default async (req: ExtendedNextApiRequest<ICreateMachineRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        alias: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const machinesSchema = await MachinesSchema()
        if (req.body.alias.length > 3 && req.body.alias.length < 30) {
          await machinesSchema.insertOne({
            alias: req.body.alias,
            token: randomstring.generate({
              length: 6,
              capitalization: 'uppercase',
              charset: 'alphabetic'
            })
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