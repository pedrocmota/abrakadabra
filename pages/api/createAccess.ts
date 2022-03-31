import type {NextApiResponse} from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {ExtendedNextApiRequest, requireParams, toID} from '../../utils/request'
import {MachinesSchema, UsersSchema, CardsSchema, AccessesSchema} from '../../models/Schemas'

interface ICreateAccessRequest {
  token: string,
  uuid: string
}

export default async (req: ExtendedNextApiRequest<ICreateAccessRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        token: 'string',
        keyType: 'string'
      },
      opcionalBody: {
        uuid: 'string'
      }
    })) {
      const machinesSchema = await MachinesSchema()
      const cardsSchema = await CardsSchema()
      const usersSchema = await UsersSchema()
      const accessesSchema = await AccessesSchema()

      dayjs.extend(utc)
      dayjs.extend(timezone)
      const machine = await machinesSchema.findOne({
        token: req.body.token || ''
      })
      if (machine) {
        const card = await cardsSchema.findOne({
          uuid: req.body.uuid
        })
        if (card) {
          const user = await usersSchema.findOne({
            _id: toID(card.user)
          })
          if (user) {
            accessesSchema.insertOne({
              user: user._id.toString(),
              place: machine._id.toString(),
              datetime: dayjs().tz('America/Bahia').unix()
            })
            return res.status(200).end()
          } else {
            return res.status(400).end()
          }
        } else {
          return res.status(404).end()
        }
      } else {
        return res.status(401).end()
      }
      return res.status(400).end()
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}