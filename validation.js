import { body } from 'express-validator'

export const authValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL(),
];

export const postValidation = [
    body('title', 'Please enter post title').isLength({min: 3}).isString(),
    body('text', 'Please enter text for post').isLength({min: 3}).isString(),
    body('tags', 'Enter correct format (should be array)').optional().isString(),
    body('imageUrl', 'Provide correct url').optional().isURL(),
];