import express from 'express'

const router = express.Router()

router.get('/api/users/currentuser',(req,res) => {
    res.status(201).send("Successful current user")
})

export {router as currentuserRouter}