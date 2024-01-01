import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import authMiddlevare from "./utils/authMiddlevare.js";
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

// Checking if user includes in request by authMiddlevare
app.get('/auth/me', authMiddlevare, async (req, res) => {
    try {

        // Getting user by id
        const user = await UserScheme.findById(req.id)

        if(!user) {
            res.status(403).json('Anuthorized')
        }
    
        const { passwordHash, ...userData } = user._doc

        // Reterning user info
        res.json({
            ...userData,
        });
    } catch (error) {
        res.status(403).json(error)
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        // Gettin user if exist
        const user = await UserScheme.findOne({ email: req.body.email })

        // Comparing user request with data in DB
        if(!user) {
            res.status(404).json('wrong info, try again');
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isPasswordValid) {
            return res.status(401).json('wrong parrword or login');
        }
    
        // Logination Success
        const token = jwt.sign({ id: user.id }, process.env.JWT_SALT);
        
        // Return user info with token
        res.json({
            ...user._doc,
            token: token,
        });

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
