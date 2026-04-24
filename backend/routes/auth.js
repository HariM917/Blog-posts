const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
        res.send({ user, token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
