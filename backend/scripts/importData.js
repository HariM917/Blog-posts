const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Post = require('../models/Post');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}
const BLOGS_DIR = path.join(__dirname, '../../archive (2)/blogs');
const IMPORT_LIMIT = 1900; // Updated per user request

async function importData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        console.log(`Checking BLOGS_DIR: ${BLOGS_DIR}`);
        if (!fs.existsSync(BLOGS_DIR)) {
            throw new Error(`Directory not found: ${BLOGS_DIR}`);
        }

        const files = fs.readdirSync(BLOGS_DIR).slice(0, IMPORT_LIMIT);
        console.log(`Found ${files.length} author files to process.`);

        for (const file of files) {
            // Filename format: id.gender.age.industry.sign.xml
            const parts = file.replace('.xml', '').split('.');
            if (parts.length < 5) continue;

            const [id, gender, age, industry, sign] = parts;
            const username = `user_${id}`;
            const email = `${id}@blogarchive.com`;

            // Find or create user
            let user = await User.findOne({ username });
            if (!user) {
                user = new User({
                    username,
                    email,
                    password: 'password123', // Default password for imported users
                    role: 'user'
                });
                await user.save();
                console.log(`Created user: ${username}`);
            }

            // Read and parse XML content
            const filePath = path.join(BLOGS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Extract posts using regex
            // Format: <date>...</date>\n<post>...</post>
            const dateRegex = /<date>(.*?)<\/date>/g;
            const postRegex = /<post>([\s\S]*?)<\/post>/g;

            const dateMatches = Array.from(content.matchAll(dateRegex));
            const postMatches = Array.from(content.matchAll(postRegex));

            const dates = dateMatches.map(m => m[1]);
            const posts = postMatches.map(m => m[1].trim());

            if (dates.length === 0) {
                console.warn(`No posts found in ${file}. Skipping.`);
                continue;
            }

            if (dates.length !== posts.length) {
                console.warn(`Warning: Date/Post mismatch in ${file}. Found ${dates.length} dates and ${posts.length} posts.`);
            }

            const postDocs = [];
            const count = Math.min(dates.length, posts.length);
            for (let i = 0; i < count; i++) {
                const postContent = posts[i];
                const postDateStr = dates[i] || '01,January,2004';
                
                // Create a title from the first few words or context
                const firstLine = postContent.split('\n')[0].trim();
                const title = firstLine.substring(0, 50).trim() || `Post from ${postDateStr}`;
                
                // Sanitize date for parsing
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
                try {
                    await Post.insertMany(postDocs);
                    console.log(`Imported ${postDocs.length} posts for ${username}`);
                } catch (insertError) {
                    console.error(`Error inserting posts for ${username}:`, insertError.message);
                }
            }
        }

        console.log('Data import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL Error during data import:', error);
        process.exit(1);
    }
}

importData();
