const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

// Add comment
router.post('/:postId', auth, async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            author: req.user._id,
            post: req.params.postId
        });
        await comment.save();

        const post = await Post.findById(req.params.postId);
        post.comments.push(comment._id);
        await post.save();

        res.status(201).send(comment);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Delete comment (author or post author)
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('post');
        if (!comment) return res.status(404).send();

        if (comment.author.toString() !== req.user._id.toString() && 
            comment.post.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Not authorized' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        
        // Remove from post
        await Post.findByIdAndUpdate(comment.post._id, { $pull: { comments: comment._id } });

        res.send(comment);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
