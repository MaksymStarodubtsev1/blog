import express from "express";

const app = express()

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login', (req, res) => {
    res.json({
        success: true,
    })
})


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
