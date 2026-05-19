const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- LOAD CONFIG ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
const MONGO_URI = process.env.MONGODB_URI;
// --- DATABASE MODELS ---
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Application = require('./models/Application');
const ActivityLog = require('./models/ActivityLog');
const Post = require('./models/Post');

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
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => console.log(`Youth Connect REAL HUB on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MONGODB CONNECTION REFUSED:', err));

// --- AUTHENTICATION ENGINE ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });
    
    const emailLower = email.toLowerCase();
    const existing = await User.findOne({ email: emailLower });
    if (existing) return res.status(400).json({ error: "Identity already registered in the grid." });

    const newUser = await User.create({ name, email: emailLower, password, role, avatar: `https://i.pravatar.cc/150?u=${email}` });
    
    await ActivityLog.create({ type: 'SIGNUP', message: `New ${role} [${name}] has entered the network.` });
    
    res.json({ message: "Access Authorized" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const emailInput = req.body.email?.trim().toLowerCase();
    const passwordInput = req.body.password?.trim();

    if (!emailInput || !passwordInput) {
        return res.status(400).json({ error: "Email and password are required." });
    }

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
    const campaigns = await Campaign.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/campaigns/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const camp = await Campaign.findByIdAndUpdate(req.params.id, { status }, { new: true });
    await ActivityLog.create({ type: 'LOG', message: `ADMIN ACTION: Campaign [${camp.title}] has been ${status.toUpperCase()}.` });
    res.json(camp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/campaigns/:id', async (req, res) => {
    try {
        const camp = await Campaign.findByIdAndDelete(req.params.id);
        await ActivityLog.create({ type: 'LOG', message: `ADMIN ACTION: Campaign [${camp.title}] has been REMOVED from the system.` });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const newCamp = await Campaign.create({ 
        ...req.body, 
        creatorId: decoded.userId,
        status: 'Pending' 
    });
    
    // Increment campaignsPosted for the user
    await User.findByIdAndUpdate(decoded.userId, { $inc: { campaignsPosted: 1 } });
    
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

app.get('/api/my-campaigns', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "Access Denied" });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const campaigns = await Campaign.find({ 
        $or: [
            { creatorId: decoded.userId },
            { creatorName: decoded.name } // Fallback for legacy data
        ]
    }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- APPLICATION ENGINE ---
app.post('/api/applications', async (req, res) => {
  try {
    const { campaignId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end();
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const existing = await Application.findOne({ userId: decoded.userId, campaignId });
    if (existing) {
        if (existing.status === 'Accepted') {
            return res.status(400).json({ error: "You have already joined this campaign." });
        }
        return res.status(400).json({ error: "Join request already sent." });
    }

    const appRequest = await Application.create({ userId: decoded.userId, campaignId, status: 'Pending' });
    await ActivityLog.create({ type: 'LOG', message: `Volunteer has applied for campaign ID: ${campaignId}` });
    res.json(appRequest);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/applications/manage', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "Access Denied" });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let apps;
    if (decoded.role === 'admin') {
      apps = await Application.find().populate('userId campaignId').sort({ createdAt: -1 });
    } else if (decoded.role === 'ngo') {
      // Find campaigns created by this manager
      const myCampaignIds = await Campaign.find({ 
          $or: [
              { creatorId: decoded.userId },
              { creatorName: decoded.name }
          ]
      }).distinct('_id');
      apps = await Application.find({ campaignId: { $in: myCampaignIds } }).populate('userId campaignId').sort({ createdAt: -1 });
    } else {
      // Volunteer: fetch applications submitted by them
      apps = await Application.find({ userId: decoded.userId }).populate('campaignId').sort({ createdAt: -1 });
    }
    res.json(apps);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { status, isRead } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status, isRead }, { new: true });
    
    if (status === 'Accepted') {
       await Campaign.findByIdAndUpdate(application.campaignId, { $inc: { filledPositions: 1 } });
    }
    
    res.json(application);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/applications/:id', async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ error: "Not found" });
        
        const oldStatus = app.status;
        const updatedApp = await Application.findByIdAndUpdate(req.params.id, { status: 'Removed' }, { new: true });

        if (oldStatus === 'Accepted') {
            await Campaign.findByIdAndUpdate(app.campaignId, { $inc: { filledPositions: -1 } });
        }
        res.json({ success: true, application: updatedApp });
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
    const allCampaigns = await Campaign.find().populate('creatorId').sort({ createdAt: -1 });
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

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await ActivityLog.create({ 
            type: 'LOG', 
            message: `SYSTEM INQUIRY: [${name}] (${email}) sent a message: ${message.substring(0, 50)}...` 
        });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMMUNITY POST ENGINE ---
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ error: "Access Denied" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: "User identity not found." });

        const { content, image } = req.body;
        const newPost = await Post.create({
            userId: decoded.userId,
            userName: user.name,
            content: content || '',
            image
        });
        
        await ActivityLog.create({ type: 'LOG', message: `User [${user.name}] posted in activity feed.` });
        res.json(newPost);
    } catch (err) { 
        console.error("🔥 POST ERROR:", err);
        res.status(500).json({ error: err.message }); 
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ error: "Access Denied" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Not found" });
        
        if (post.userId.toString() !== decoded.userId && decoded.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts/:id/like', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ error: "Access Denied" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const post = await Post.findById(req.params.id);
        if (!post.likes) post.likes = [];
        
        if (post.likes.includes(decoded.userId)) {
            post.likes = post.likes.filter(id => id.toString() !== decoded.userId);
        } else {
            post.likes.push(decoded.userId);
        }
        await post.save();
        res.json(post);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

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

// --- USER PROFILE ENGINE ---
app.get('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "Access Denied" });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "Access Denied" });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { name, skills } = req.body;
    const user = await User.findByIdAndUpdate(decoded.userId, { name, skills }, { new: true });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
