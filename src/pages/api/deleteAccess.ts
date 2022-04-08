import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {AccessesSchema} from '../../models/Schemas'

interface IDeleteAccessRequest {
  accessID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteAccessRequest>, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    if (requireParams(req, {
      body: {
        accessID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const accessSchema = await AccessesSchema()
        await accessSchema.deleteOne({
          _id: toID(req.body.accessID)
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