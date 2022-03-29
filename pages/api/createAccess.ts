import type {NextApiResponse} from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {ExtendedNextApiRequest, requireParams, toID} from '../../utils/request'
import {MachinesSchema, UsersSchema, CardsSchema, AccessesSchema} from '../../models/Schemas'

interface ICreateAccessRequest {
  token: string,
  keyType: string,
  uuid: string,
  pin: string
}

export default async (req: ExtendedNextApiRequest<ICreateAccessRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (requireParams(req, {
      body: {
        token: 'string',
        keyType: 'string'
      },
      opcionalBody: {
        uuid: 'string',
        pin: 'string'
      }
    })) {
      const machinesSchema = await MachinesSchema()
      const cardsSchema = await CardsSchema()
      const usersSchema = await UsersSchema()
      const accessesSchema = await AccessesSchema()

      dayjs.extend(utc)
      dayjs.extend(timezone)
      const keyType = req.body.keyType as string
      if (keyType === 'Cartão') {
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
                keyType: 'Cartão',
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
      }
      if (keyType === 'PIN') {
        const machine = await machinesSchema.findOne({
          token: req.body.token
        })
        if (machine) {
          const user = await usersSchema.findOne({
            pin: parseInt(req.body.pin)
          })
          if (user) {
            accessesSchema.insertOne({
              user: user._id.toString(),
              place: machine._id.toString(),
              keyType: 'PIN',
              datetime: dayjs().tz('America/Bahia').unix()
            })
            return res.status(200).end()
          } else {
            return res.status(404).end()
          }
        } else {
          return res.status(401).end()
        }
      }
      return res.status(400).end()
    } else {
      return res.status(422).end()
    }
  } else {
    return res.status(405).end()
  }
}