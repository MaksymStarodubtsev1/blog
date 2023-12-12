import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { authValidator } from './validation/auth.js'

dotenv.config()

mongoose.connect(
    `mongodb+srv://MobileDatabase:${process.env.MONGODB_KEY}@cluster0.ggvs8al.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => console.log('Success connected'))
.catch((error) => console.log('errror', error))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/register', authValidator, (req, res) => {})


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
