import Post from '../modules/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.body.userId,
        });

        const post = await doc.save();

        res.json(post);


    } catch(error) {
        console.log(error)
        res.status(500).json('Error appear, try again with other info');
    }
}