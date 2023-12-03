import express from "express";

const app = express()

app.get('/', (req, res) => {
    res.send('Hello world')
})


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
