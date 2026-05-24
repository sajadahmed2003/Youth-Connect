const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Kanav_db_user:Kanav_db_user1@cluster0.gszfza5.mongodb.net/youthconnect?retryWrites=true&w=majority&appName=Cluster0';

// Define schemas to match the database
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, default: 'password' },
    role: String,
    avatar: String,
    points: { type: Number, default: 0 },
    badges: [{ title: String, icon: String }],
    skills: [String],
    campaignsJoined: { type: Number, default: 0 },
    campaignsCompleted: { type: Number, default: 0 }
}, { collection: 'users' });

const CampaignSchema = new mongoose.Schema({
    title: String,
    creatorName: String,
    creatorId: mongoose.Schema.Types.ObjectId,
    categories: [String],
    location: String,
    description: String,
    neededPositions: Number,
    filledPositions: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' },
    targetAmount: { type: Number, default: 300000 },
    raisedAmount: { type: Number, default: 0 },
    image: String,
    donations: [mongoose.Schema.Types.Mixed]
}, { collection: 'campaigns' });

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
}, { collection: 'applications' });

const User = mongoose.model('User', UserSchema);
const Campaign = mongoose.model('Campaign', CampaignSchema);
const Application = mongoose.model('Application', ApplicationSchema);

async function run() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // 1. Setup Volunteer
        let volunteer = await User.findOne({ email: 'volunteer@connect.com' });
        if (!volunteer) {
            volunteer = await User.create({
                name: 'Kanav Volunteer',
                email: 'volunteer@connect.com',
                password: 'password',
                role: 'volunteer',
                avatar: 'https://i.pravatar.cc/150?u=vol',
                points: 450,
                skills: ['Environment', 'Leadership', 'Teaching', 'Fundraising'],
                campaignsJoined: 1,
                campaignsCompleted: 0,
                badges: [
                    { title: 'Bronze Hero', icon: '🥉' },
                    { title: 'Eco Guardian', icon: '🌲' }
                ]
            });
            console.log('Created Volunteer: volunteer@connect.com / password');
        } else {
            volunteer.role = 'volunteer';
            volunteer.points = 450;
            volunteer.skills = ['Environment', 'Leadership', 'Teaching', 'Fundraising'];
            volunteer.campaignsJoined = 1;
            volunteer.badges = [
                { title: 'Bronze Hero', icon: '🥉' },
                { title: 'Eco Guardian', icon: '🌲' }
            ];
            await volunteer.save();
            console.log('Updated existing volunteer credentials.');
        }

        // 2. Setup NGO Manager
        let ngo = await User.findOne({ email: 'ngo@connect.com' });
        if (!ngo) {
            ngo = await User.create({
                name: 'Green Earth NGO',
                email: 'ngo@connect.com',
                password: 'password',
                role: 'ngo',
                avatar: 'https://i.pravatar.cc/150?u=ngo',
                skills: ['Management', 'Public Relations']
            });
            console.log('Created NGO: ngo@connect.com / password');
        } else {
            ngo.role = 'ngo';
            await ngo.save();
            console.log('Updated existing NGO credentials.');
        }

        // 3. Setup Approved Campaign with Crowdfunding stats
        let campaign = await Campaign.findOne({ title: 'Clean Energy Drive 2026' });
        if (!campaign) {
            campaign = await Campaign.create({
                title: 'Clean Energy Drive 2026',
                creatorName: 'Green Earth NGO',
                creatorId: ngo._id,
                categories: ['Environment'],
                location: 'New Delhi, India',
                description: 'Join us to distribute and install solar lighting kits in local rural areas and promote green solutions.',
                neededPositions: 15,
                filledPositions: 1,
                status: 'Approved',
                targetAmount: 300000,
                raisedAmount: 185000,
                image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
                donations: [
                    { donorName: 'Alice', amount: 50000, date: new Date() },
                    { donorName: 'Bob', amount: 135000, date: new Date() }
                ]
            });
            console.log('Created Campaign: Clean Energy Drive 2026');
        } else {
            campaign.creatorId = ngo._id;
            campaign.status = 'Approved';
            campaign.targetAmount = 300000;
            campaign.raisedAmount = 185000;
            campaign.filledPositions = 1;
            await campaign.save();
            console.log('Updated existing Campaign parameters.');
        }

        // 4. Setup Accepted Application
        let app = await Application.findOne({ userId: volunteer._id, campaignId: campaign._id });
        if (!app) {
            app = await Application.create({
                userId: volunteer._id,
                campaignId: campaign._id,
                status: 'Accepted',
                isRead: false
            });
            console.log('Created Accepted Application linking Volunteer and Campaign.');
        } else {
            app.status = 'Accepted';
            await app.save();
            console.log('Updated Application status to Accepted.');
        }

        console.log('🎉 Data successfully seeded to live Atlas DB cluster!');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
