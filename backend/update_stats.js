const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function updateStats() {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.findOneAndUpdate(
        { name: 'sajjad3' },
        { campaignsJoined: 6, campaignsCompleted: 2 },
        { new: true }
    );
    console.log('Updated User Stats:', result);
    process.exit();
}
updateStats();
