import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { authValidator } from './validation/auth.js'

import { validationResult } from "express-validator"
import UserScheme from "./modules/User.js"

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

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserScheme.findOne({ email: req.body.email })

        if(!user) {
            res.status(404).json('wrong info, try again')
        }

        res.json('login success')
    } catch (error) {
        res.status(505).json('wrong auth info')
    }
})

app.post('/auth/register', authValidator, async (req, res) => {
    try {
        const errors = validationResult(req)

        // Checking request info on Errors
        if(!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }
    
        // Genereting password hash
        const password = req.body.password;
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = await bcrypt.hash(password, salt)
    
        // Creating User Scheme
        const document = new UserScheme({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash,
            avatarUrl: req.body.avatarUrl || ''
        })
    
        const user = await document.save()

        const token = jwt.sign({ id: user.id }, process.env.JWT_SALT);
    
        // Registration Success
        res.json({
            ...user._doc,
            token: token,
        });

    } catch(error) {
        res.status(500).json('Error appear, try again with other names')
    }
})


app.listen(3333, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server Ok');
    }
})
