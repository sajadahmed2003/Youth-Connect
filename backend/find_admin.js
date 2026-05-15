const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function findAdmin() {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await User.find({ role: 'admin' });
    console.log('Admins found:', admins);
    process.exit();
}
findAdmin();
