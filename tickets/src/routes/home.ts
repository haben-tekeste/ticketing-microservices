import express from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', async (req: express.Request,res:express.Response, next: express.NextFunction) => {
    try {
        const tickets = await Ticket.find({})
        res.status(200).send(tickets)
    } catch (error) {
        return next(error)
    }
})

export { router as getAllTicketsRouter}