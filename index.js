import express from "express";
import mongoose from "mongoose";
import authMiddlevare from "./utils/authMiddlevare.js";
import * as dotenv from "dotenv";
import { authValidator } from './validation/auth.js'

import { register,getMe, login } from "./controllers/UserControllers.js";

dotenv.config()

mongoose.connect(
    `mongodb+srv://MobileDatabase:${process.env.MONGODB_KEY}@cluster0.ggvs8al.mongodb.net/blog?retryWrites=true&w=majority`
)
.then(() => console.log('Success connected'))
.catch((error) => console.log('errror', error))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

// Checking if user includes in request by authMiddlevare
app.get('/auth/me', authMiddlevare, getMe)

app.post('/auth/login', login)

app.post('/auth/register', register)


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
