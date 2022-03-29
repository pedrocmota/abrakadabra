import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {UsersSchema, AccessesSchema, MachinesSchema} from '../../models/Schemas'

interface IGetAccessesByUserRequest {
  userID: string
}

export default async (req: ExtendedNextApiRequest<IGetAccessesByUserRequest>, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (requireParams(req, {
      query: {
        userID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const usersSchema = await UsersSchema()
        const accessesSchema = await AccessesSchema()
        const machinesSchema = await MachinesSchema()

        const allUsers = await usersSchema.find().toArray()
        const allMachines = await machinesSchema.find().toArray()
        const accesses = (await accessesSchema.find({
          user: req.query.userID
        }, {
          sort: {datetime: 1}
        }).toArray()).map(doc => {
          return ({
            ...doc,
            _id: doc._id.toString(),
            place: allMachines.find(e => e._id.toString() === doc.place)?.alias || 'Desconhecido',
            userName: allUsers.find(e => e._id.toString() === doc.user)?.name || 'Desconhecido'
          })
        })
        return res.json(accesses)
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