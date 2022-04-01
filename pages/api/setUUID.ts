import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {CardsSchema, MachinesSchema} from '../../models/Schemas'

interface ISetUUIDRequest {
  token: string,
  uuid: string
}

export default async (req: ExtendedNextApiRequest<ISetUUIDRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        token: 'string',
        uuid: 'string'
      }
    })) {
      const machinesSchema = await MachinesSchema()
      const cardSchema = await CardsSchema()

      const machine = await machinesSchema.findOne({
        token: req.body.token
      })
      if (machine) {
        const cardWithoutUUID = (await cardSchema.findOne({
          status: 3
        }))
        if (cardWithoutUUID) {
          if (req.body.uuid.length > 3 && req.body.uuid.length < 10) {
            await cardSchema.updateOne({status: 3}, {
              $set: {
                status: 1, uuid: req.body.uuid
              }
            })
            return res.status(200).end()
          } else {
            return res.status(405).end()
          }
        } else {
          return res.status(404).end()
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