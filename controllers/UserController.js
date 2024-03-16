import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator"
import UserScheme from "../modules/User.js"

export const login = async (req, res) => {
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
}

export const getMe = async (req, res) => {
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
}

export const register = async (req, res) => {
    try {
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
}
