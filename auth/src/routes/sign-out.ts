import express from "express"

const router = express.Router();

router.post('/api/users/signout',(req,res) => {
    res.status(200).send("Successful sign out")
})

export {router as signoutRouter}