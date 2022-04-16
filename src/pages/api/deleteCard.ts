import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {CardsSchema} from '../../models/Schemas'

interface IDeleteCardRequest {
  cardID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteCardRequest>, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    if (requireParams(req, {
      body: {
        cardID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const cardsSchema = await CardsSchema()
        await cardsSchema.deleteOne({
          _id: toID(req.body.cardID)
        })
        return res.status(200).end()
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