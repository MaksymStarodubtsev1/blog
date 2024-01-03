import PostModel from '../modules/Post.js';
import { validationResult } from "express-validator"

export const create = async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            console.log('errors', errors)
            res.status(400).json(errors.array())
        }

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.id,
        });

        const post = await doc.save();

        res.json(post);


    } catch(error) {
        console.log(error)
        res.status(500).json('Error appear, try again with other info');
    }
}