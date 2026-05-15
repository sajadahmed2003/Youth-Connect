const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Post = require('./models/Post');

const posts = [
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Just finished our weekend Tree Plantation drive! We planted over 50 saplings today. Let\'s make our city green! 🌿 #GreenConnect #VolunteerWork',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Beach Cleanup was a huge success! Look at all the trash we collected. Protect our oceans! 🌊🏖️ #SaveTheOcean #YouthConnect',
        image: 'https://images.unsplash.com/photo-1618477462146-050d2767eac4?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Spent the morning teaching these amazing kids. Education is the most powerful weapon. 📚✨ #EducationForAll #Empowerment',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Food distribution drive in the local community. No one should sleep hungry. ❤️🍱 #ZeroHunger #CommunitySupport',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Volunteering at the animal shelter today. These little paws deserve all the love! 🐾🐕 #AnimalLovers #VolunteerLife',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Visited a senior home today. The stories they shared were truly inspiring. 👴👵💖 #IntergenerationalBond #Kindness',
        image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Recycling awareness workshop! Small steps lead to big changes. ♻️🌎 #SustainableLiving #EcoFriendly',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Working in our new community garden! Fresh vegetables for everyone. 🥦🥕 #OrganicLiving #CommunityGarden',
        image: 'https://images.unsplash.com/photo-1592150621344-c792307f39b7?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Learning about water conservation at today\'s workshop. Save water, save life! 💧🚿 #WaterConservation #Awareness',
        image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1000'
    },
    {
        userId: '69fab0d9287907070e4ab3db',
        userName: 'sajjad3',
        content: 'Gave blood today at the mega donation camp. One pint can save three lives! 🩸🚑 #BloodDonation #HeroInYou',
        image: 'https://images.unsplash.com/photo-1536856789446-79f526e24744?q=80&w=1000'
    }
];

async function seedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB...');
        await Post.insertMany(posts);
        console.log('10 Posts Successfully Created!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seedPosts();
