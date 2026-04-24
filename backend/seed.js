const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-platform';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create a sample user
        const user = new User({
            username: 'EditorInChief',
            email: 'editor@modernblog.com',
            password: 'password123',
            role: 'admin'
        });
        await user.save();
        console.log('Sample user created');

        // Sample Posts
        const posts = [
            {
                title: 'The Future of AI in Modern Design',
                content: 'As artificial intelligence continues to evolve, its impact on the design world is becoming more profound. From generative art to automated UI layout, the boundaries between human creativity and machine precision are blurring. In this article, we explore how designers can leverage AI to enhance their workflows without losing their unique artistic voice...',
                author: user._id,
                tags: ['AI', 'Design', 'Future']
            },
            {
                title: 'Minimalism: More Than Just an Aesthetic',
                content: 'Minimalism is often misunderstood as simply having fewer things. In reality, it is a philosophy of intentionality. By removing the non-essential, we make space for what truly matters in our lives, our work, and our digital products. We look at how the "less is more" approach is shaping the next generation of SaaS products...',
                author: user._id,
                tags: ['Minimalism', 'Lifestyle', 'SaaS']
            },
            {
                title: 'The Rise of Hybrid Work Cultures',
                content: 'The traditional office space is undergoing a radical transformation. With the rise of distributed teams and digital nomads, organizations are redefining what "work" looks like. We investigate the challenges and opportunities of hybrid work cultures and how modern tools are making it easier to collaborate across time zones...',
                author: user._id,
                tags: ['Work', 'Remote', 'Productivity']
            },
            {
                title: 'Mastering the Art of Digital Storytelling',
                content: 'In an age of information overload, storytelling is the most powerful way to capture attention. Whether you are a blogger, a marketer, or a developer, knowing how to craft a compelling narrative around your work is essential. Here are five tips to help you master the art of digital storytelling in 2026...',
                author: user._id,
                tags: ['Writing', 'Storytelling', 'Marketing']
            }
        ];

        await Post.insertMany(posts);
        console.log('Sample posts created');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
