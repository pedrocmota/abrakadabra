import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession, toID} from '../../utils/request'
import {MachinesSchema, AccessesSchema} from '../../models/Schemas'

interface IDeleteMachineRequest {
  machineID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteMachineRequest>, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    if (requireParams(req, {
      body: {
        machineID: 'string'
      }
    })) {
      const session = requireSession(req.cookies.session, true)
      if (session) {
        const machinesSchema = await MachinesSchema()
        const accessesSchema = await AccessesSchema()

        await machinesSchema.deleteOne({
          _id: toID(req.body.machineID)
        })
        await accessesSchema.deleteMany({
          place: req.body.machineID
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