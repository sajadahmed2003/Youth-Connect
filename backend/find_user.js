const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function findUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ name: 'sajjad3' });
    console.log(user);
    process.exit();
}
findUser();
