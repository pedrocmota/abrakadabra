import type {NextApiResponse} from 'next'
import randomstring from 'randomstring'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {UsersSchema, CardsSchema} from '../../models/Schemas'

interface ICreateCardRequest {
  alias: string,
  userID: string
}

export default async (req: ExtendedNextApiRequest<ICreateCardRequest>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      alias: 'string',
      userID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const usersSchema = await UsersSchema()
  const cardsSchema = await CardsSchema()
  const user = await usersSchema.findOne({
    _id: toID(req.body.userID)
  })
  const cardsAmount = await cardsSchema.countDocuments()
  if (cardsAmount === 200) {
    return res.status(423).end()
  }
  if (user && req.body.alias.length > 3 && req.body.alias.length < 30) {
    await cardsSchema.insertOne({
      alias: req.body.alias,
      user: req.body.userID,
      code: randomstring.generate({
        charset: 'numeric',
        length: 6
      }),
      status: 0
    })
    return res.status(200).end()
  } else {
    return res.status(400).end()
  }
}