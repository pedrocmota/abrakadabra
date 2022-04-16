import type {NextApiResponse} from 'next'
import crypto from 'crypto'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {MachinesSchema, CardsSchema} from '../../models/Schemas'

interface ISyncRequest {
  token: string
}

export default async (req: ExtendedNextApiRequest<ISyncRequest>, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    query: {
      token: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const machinesSchema = await MachinesSchema()
  const cardsSchema = await CardsSchema()
  const machine = await machinesSchema.findOne({
    token: req.query.token
  })
  if (!machine) {
    return res.status(401).end()
  }
  const cards = (await cardsSchema.find().project({_id: 0, uuid: 1, status: 1}).toArray())
  const cardsArray = cards.filter((card) => card !== null && card.status === 1).map((e) => e.uuid) as string[]
  const hash = crypto.createHash('shake256', {outputLength: 8}).update(cardsArray.toString()).digest('hex')
  res.json({
    inReadingMode: cards.some((card) => card.status === 3),
    cards: cardsArray,
    hash: hash
  })
}