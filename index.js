import express from "express";
import mongoose from "mongoose";
import authMiddlevare from "./utils/authMiddlevare.js";
import * as dotenv from "dotenv";
import { authValidator, postValidation } from './validation.js'

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

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
app.get('/auth/me', authMiddlevare, UserController.getMe)
app.post('/auth/login', UserController.login)
app.post('/auth/register', authValidator, UserController.register)

app.post('/post', postValidation, authMiddlevare, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', authMiddlevare, PostController.remove)


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
