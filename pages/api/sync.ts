import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {MachinesSchema, UsersSchema, CardsSchema} from '../../models/Schemas'

interface ISyncRequest {
  token: string
}

export default async (req: ExtendedNextApiRequest<ISyncRequest>, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (requireParams(req, {
      query: {
        token: 'string'
      }
    })) {
      const machinesSchema = await MachinesSchema()
      const usersSchema = await UsersSchema()
      const cardsSchema = await CardsSchema()
      const machine = await machinesSchema.findOne({
        token: req.query.token
      })
      if (machine) {
        const pins = (await usersSchema.find({}).project({_id: 0, pin: 1})
          .toArray())
          .filter((e) => e.pin)
          .map((e) => e.pin)
        const cards = (await cardsSchema.find({status: 1}).project({_id: 0, uuid: 1}).toArray())
          .map((e) => e.uuid).filter((e) => e != null)
        res.json({
          pins: pins,
          cards: cards
        })
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