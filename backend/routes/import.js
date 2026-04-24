const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Post = require('../models/Post');

const BLOGS_DIR = path.join(__dirname, '../../archive (2)/blogs');
const IMPORT_LIMIT = 1900;

router.get('/', async (req, res) => {
    try {
        console.log('Starting data import via API...');
        
        if (!fs.existsSync(BLOGS_DIR)) {
            return res.status(500).send({ error: `Directory not found: ${BLOGS_DIR}` });
        }

        const files = fs.readdirSync(BLOGS_DIR).slice(0, IMPORT_LIMIT);
        let userCount = 0;
        let postCount = 0;

        for (const file of files) {
            const parts = file.replace('.xml', '').split('.');
            if (parts.length < 5) continue;

            const [id, gender, age, industry, sign] = parts;
            const username = `user_${id}`;
            const email = `${id}@blogarchive.com`;

            let user = await User.findOne({ username });
            if (!user) {
                user = new User({
                    username,
                    email,
                    password: 'password123',
                    role: 'user'
                });
                await user.save();
                userCount++;
            }

            const filePath = path.join(BLOGS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            const dateRegex = /<date>(.*?)<\/date>/g;
            const postRegex = /<post>([\s\S]*?)<\/post>/g;

            const dates = Array.from(content.matchAll(dateRegex)).map(m => m[1]);
            const posts = Array.from(content.matchAll(postRegex)).map(m => m[1].trim());

            const postDocs = [];
            const count = Math.min(dates.length, posts.length);
            for (let i = 0; i < count; i++) {
                const postContent = posts[i];
                const postDateStr = dates[i] || '01,January,2004';
                const firstLine = postContent.split('\n')[0].trim();
                const title = firstLine.substring(0, 50).trim() || `Post from ${postDateStr}`;
                
                const sanitizedDate = postDateStr.replace(/,/g, ' ');
                const parsedDate = new Date(sanitizedDate);
                
                postDocs.push({
                    title: title.length > 5 ? title : `Blog Post - ${postDateStr}`,
                    content: postContent,
                    author: user._id,
                    tags: [industry, sign, gender],
                    createdAt: isNaN(parsedDate.getTime()) ? new Date() : parsedDate
                });
            }

            if (postDocs.length > 0) {
                await Post.insertMany(postDocs);
                postCount += postDocs.length;
            }
        }

        res.send({
            message: 'Import completed successfully',
            usersCreated: userCount,
            postsCreated: postCount
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
