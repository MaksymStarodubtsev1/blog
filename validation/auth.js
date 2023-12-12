import { body } from 'express-validator'

export const authValidator = [
    body('email').isEmail(),
    body('password').length({min: 5}),
    body('fullName').length({min: 3}),
    body('avatarUrl').optional().isURL(),
]