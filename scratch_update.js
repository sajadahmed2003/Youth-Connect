const fs = require('fs');
let code = fs.readFileSync('backend/index.js', 'utf8');
code = code.replace(
  /app\.put\(\'\/api\/applications\/:id\', async \(req, res\) => \{[\s\S]*?res\.json\(application\);\n  \} catch \(err\) \{ res\.status\(500\)\.json\(\{ error: err\.message \}\); \}\n\}\);/,
  `app.put('/api/applications/:id', async (req, res) => {
  try {
    const { status, isRead } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status, isRead }, { new: true });
    
    if (status === 'Accepted') {
       await Campaign.findByIdAndUpdate(application.campaignId, { $inc: { filledPositions: 1 } });
       await User.findByIdAndUpdate(application.userId, { $inc: { campaignsJoined: 1 } });
    } else if (status === 'Completed') {
       await User.findByIdAndUpdate(application.userId, { $inc: { campaignsCompleted: 1 } });
    }
    
    res.json(application);
  } catch (err) { res.status(500).json({ error: err.message }); }
});`
);
fs.writeFileSync('backend/index.js', code);
console.log('done');
