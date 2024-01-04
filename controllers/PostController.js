import PostModel from '../modules/Post.js';
import { validationResult } from "express-validator"


export const getAll = async (req, res) => {
    try {
        const doc = await PostModel.find().populate('user').exec()

        res.json(doc)

    } catch(error) {
        res.status(500).json('Error appear, try again with other info')
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewCount: 1},
            },
            {
                returnDocument: 'after',
            }
        ).exec()
        
        res.json(doc)

    } catch(error) {
        res.status(404).json('Error appear, no info found')
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findByIdAndDelete({
            _id: postId,
        })
        .then((doc) => {
            res.json(doc)
        })
        .catch(() => {
            res.status(404).json('Cannot delete post')
        })

    } catch(error) {
        res.status(404).json('Error appear, no info found')
    }
}

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