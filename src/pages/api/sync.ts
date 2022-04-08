import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {MachinesSchema, CardsSchema} from '../../models/Schemas'

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
      const cardsSchema = await CardsSchema()
      const machine = await machinesSchema.findOne({
        token: req.query.token
      })
      if (machine) {
        const cards = (await cardsSchema.find()
          .project({_id: 0, uuid: 1, status: 1})
          .toArray())
        res.json({
          inReadingMode: cards.some((card) => card.status === 3),
          cards: cards
            .filter((card) => card !== null && card.status === 1)
            .map((e) => e.uuid)
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