const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- LOAD CONFIG ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
const MONGO_URI = process.env.MONGODB_URI;

// --- DATABASE MODELS ---
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Application = require('./models/Application');
const ActivityLog = require('./models/ActivityLog');

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('📡 REAL DATABASE CONNECTED: MongoDB Atlas Protocol Active.');
    
    // Ensure Super Admin exists in the real DB
    const adminExists = await User.findOne({ email: 'admin@connect.com' });
    if (!adminExists) {
        await User.create({
            name: 'Global Admin',
            email: 'admin@connect.com',
            password: 'admin',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/150?u=adm'
        });
        console.log('🛡️ Super Admin initialized in Real DB.');
    }
  })
  .catch(err => console.error('❌ MONGODB CONNECTION REFUSED:', err));

// --- AUTHENTICATION ENGINE ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Identity already registered in the grid." });

    const newUser = await User.create({ name, email: email.toLowerCase(), password, role, avatar: `https://i.pravatar.cc/150?u=${email}` });
    
    await ActivityLog.create({ type: 'SIGNUP', message: `New ${role} [${name}] has entered the network.` });
    
    res.json({ message: "Access Authorized" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const emailInput = req.body.email?.trim().toLowerCase();
    const passwordInput = req.body.password?.trim();

    // --- NUCLEAR BYPASS FOR PROTOTYPE ---
    if (emailInput === 'admin@connect.com') {
        const admin = await User.findOne({ email: 'admin@connect.com' });
        const token = jwt.sign({ userId: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '10d' });
        return res.json({ token, user: admin });
    }

    const user = await User.findOne({ email: emailInput });
    if (!user || user.password !== passwordInput) {
        return res.status(401).json({ error: "CRITICAL: NODE REJECTION" });
    }

    await ActivityLog.create({ type: 'LOGIN', message: `${user.role.toUpperCase()} [${user.name}] identity verified.` });

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '10d' });
    res.json({ token, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CAMPAIGN ENGINE ---
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const newCamp = await Campaign.create({ ...req.body, status: 'Pending' });
    res.json(newCamp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ campaignId: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/campaigns/:id/approve', async (req, res) => {
  try {
    const camp = await Campaign.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    res.json(camp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- APPLICATION ENGINE ---
app.get('/api/applications/manage', async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('userId')
      .populate('campaignId')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { campaignId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end();
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const existing = await Application.findOne({ userId: decoded.userId, campaignId });
    if (existing) return res.status(400).json({ error: "Deployment already requested." });

    const appRequest = await Application.create({ userId: decoded.userId, campaignId, status: 'Pending' });
    res.json(appRequest);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (status === 'Accepted') {
       await Campaign.findByIdAndUpdate(application.campaignId, { $inc: { filledPositions: 1 } });
    }
    
    res.json(application);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/applications/:id', async (req, res) => {
    try {
        const app = await Application.findByIdAndDelete(req.params.id);
        if (app && app.status === 'Accepted') {
            await Campaign.findByIdAndUpdate(app.campaignId, { $inc: { filledPositions: -1 } });
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN HUB ENGINE ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalApplications = await Application.countDocuments();
    const volunteerCount = await User.countDocuments({ role: 'volunteer' });
    const managerCount = await User.countDocuments({ role: 'ngo' });
    
    const allUsers = await User.find().limit(50);
    const allCampaigns = await Campaign.find().sort({ createdAt: -1 });
    const allApplications = await Application.find().populate('userId campaignId').sort({ createdAt: -1 });
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20);

    res.json({
        totalUsers, totalCampaigns, totalApplications, volunteerCount, managerCount,
        allUsers, allCampaigns,
        allApplications: allApplications.map(a => ({
            _id: a._id,
            userName: a.userId?.name,
            campaignTitle: a.campaignId?.title,
            status: a.status
        })),
        logs
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SOCIAL ENGINE (LIKE/COMMENT) ---
app.post('/api/campaigns/:id/like', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const camp = await Campaign.findById(req.params.id);
        if (!camp.likes) camp.likes = [];
        
        if (camp.likes.includes(decoded.userId)) {
            camp.likes = camp.likes.filter(id => id.toString() !== decoded.userId);
        } else {
            camp.likes.push(decoded.userId);
        }
        await camp.save();
        res.json(camp);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/campaigns/:id/comment', async (req, res) => {
    try {
        const { text } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        const camp = await Campaign.findById(req.params.id);
        
        if (!camp.comments) camp.comments = [];
        camp.comments.push({ userId: user._id, userName: user.name, text, createdAt: new Date() });
        
        await camp.save();
        res.json(camp);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5003;
app.listen(PORT, () => console.log(`Campaign Connect REAL HUB on http://localhost:${PORT}`));
