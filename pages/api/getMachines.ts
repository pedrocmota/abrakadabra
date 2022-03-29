import type {NextApiRequest, NextApiResponse} from 'next'
import {requireSession} from '../../utils/request'
import {MachinesSchema} from '../../models/Schemas'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const session = requireSession(req.cookies.session, true)
    if (session) {
      const machinesSchema = await MachinesSchema()

      const allMachines = (await machinesSchema.find().toArray()).map(doc => {
        return ({
          ...doc,
          _id: doc._id.toString()
        })
      })
      return res.json(allMachines)
    } else {
      return res.status(401).end()
    }
  } else {
    return res.status(405).end()
  }
}