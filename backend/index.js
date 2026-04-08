require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Opportunity = require('./models/Opportunity');
const UserProfile = require('./models/UserProfile');
const Application = require('./models/Application');
const User = require('./models/User');

const app = express();
app.use(express.json());

app.use(cors());

// Connect to MongoDB Atlas via Environment Variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas database 'youthconnect'"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_youthconnect_key';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Endpoints ---

// Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists with this email." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name: user.name, email: user.email, avatar: user.avatar, skills: user.skills } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all opportunities with mock AI Match Score
app.get('/api/opportunities', async (req, res) => {
  try {
    const opps = await Opportunity.find();
    
    // MOCK AI MATCHING ENGINE
    const oppsWithScores = opps.map(opp => {
      // Generate a random match score between 55 and 98
      const score = Math.floor(Math.random() * (98 - 55 + 1) + 55);
      return {
        ...opp.toObject(),
        matchScore: score,
        matchReasoning: `Strong alignment with ${opp.requiredSkills[0] || 'your core skills'}.`,
        missingSkills: opp.requiredSkills.slice(1, 2)
      };
    });
    
    // Sort by match score descending
    oppsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json(oppsWithScores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create an opportunity
app.post('/api/opportunities', async (req, res) => {
  try {
    const newOpp = new Opportunity(req.body);
    const savedOpp = await newOpp.save();
    res.status(201).json(savedOpp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seed data route for testing
app.post('/api/seed', async (req, res) => {
    try {
        await Opportunity.deleteMany();
        const initialOpps = [
            {
                title: "Community Garden Restorer",
                orgName: "Green Earth Initiative",
                description: "Help us restore the local community garden by planting new seeds and building wooden flower beds.",
                location: "Downtown Park",
                requiredSkills: ["Gardening", "Teamwork", "Physical Labor"],
                categories: ["Environment"],
            },
            {
                title: "Web Developer for NGO",
                orgName: "Tech for Good",
                description: "We need a frontend developer to revamp our donation portal for easier access.",
                location: "Remote",
                requiredSkills: ["React", "UI/UX", "Web Development"],
                categories: ["Technology"]
            },
            {
                title: "After-School Math Tutor",
                orgName: "Bright Futures",
                description: "Tutor high school students in algebra and geometry twice a week.",
                location: "Westside High School",
                requiredSkills: ["Mathematics", "Teaching", "Patience"],
                categories: ["Education"]
            }
        ];
        const inserted = await Opportunity.insertMany(initialOpps);
        res.json({ message: "Seeded initial opportunities", data: inserted });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Dashboard Insights
app.get('/api/dashboard', async (req, res) => {
  res.json({
    totalImpactValue: '₹140,000',
    activeApplications: 2,
    hoursVolunteered: 24,
    topSkillsMatched: ['Web Development', 'React']
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Youth Connect backend running on http://localhost:${PORT}`);
});
