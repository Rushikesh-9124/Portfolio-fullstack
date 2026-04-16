const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { protect } = require('../middleware/auth');

// GET /api/about
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        name: 'Alex Johnson',
        title: 'Full Stack Developer',
        subtitle: 'AI/ML Engineer',
        bio: 'Passionate developer building the future with code.',
        location: 'San Francisco, CA',
        yearsExperience: 5,
        projectsCompleted: 30,
        timeline: [
          { year: '2024', title: 'Senior Developer', company: 'TechCorp', description: 'Leading frontend architecture', type: 'work' },
          { year: '2022', title: 'Full Stack Developer', company: 'StartupXYZ', description: 'Built scalable web applications', type: 'work' },
          { year: '2020', title: 'B.S. Computer Science', company: 'State University', description: 'Graduated with honors', type: 'education' }
        ]
      });
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/about (protected)
router.put('/', protect, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: true });
    } else {
      about = await About.create(req.body);
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
