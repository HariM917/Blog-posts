const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

// Create post
router.post('/', auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        await post.save();
        res.status(201).send(post);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(50);
        res.send(posts);
    } catch (e) {
        res.status(500).send();
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });
        if (!post) return res.status(404).send();
        res.send(post);
    } catch (e) {
        res.status(500).send();
    }
});

// Update post
router.patch('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
        if (!post) return res.status(404).send();
        
        Object.keys(req.body).forEach(update => post[update] = req.body[update]);
        await post.save();
        res.send(post);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        if (!post) return res.status(404).send();
        res.send(post);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
