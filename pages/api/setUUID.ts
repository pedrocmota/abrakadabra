import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {CardsSchema, MachinesSchema} from '../../models/Schemas'

interface ISetUUIDRequest {
  uuid: string,
  token: string
}

export default async (req: ExtendedNextApiRequest<ISetUUIDRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!requireParams(req, {
      query: {
        uuid: 'string',
        token: 'string'
      }
    })) {
      const machinesSchema = await MachinesSchema()
      const cardSchema = await CardsSchema()

      const machine = await machinesSchema.findOne({
        token: req.body.token
      })
      if (!machine) {
        return res.status(401).end()
      }
      await cardSchema.updateOne({status: 3}, {status: 1, uuid: req.body.uuid})
      return res.status(200).end()
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}