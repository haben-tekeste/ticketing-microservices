import express from "express";

const app = express();

app.use(express.json());

app.get('/api/users/currentuser',(req,res) => {
    res.send('Hi there')
})

app.listen(4000,() => {
    console.log('Auth Service at port 4000');
})