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

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            console.log('errors', errors)
            res.status(400).json(errors.array())
        }

        PostModel.findByIdAndUpdate({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            ...req.body,
        }, {new: true})
        .then(updatedDoc => {
            res.json(updatedDoc)
        })
        .catch(() => {
            res.status(403).json('Could not to update post')
        })


    } catch(error) {
        res.status(400).json('Error appear, no info found')
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