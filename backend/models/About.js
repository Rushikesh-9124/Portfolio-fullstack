const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Your Name' },
  title: { type: String, required: true, default: 'Full Stack Developer' },
  subtitle: { type: String, default: 'AI/ML Engineer' },
  bio: { type: String, required: true, default: 'Your bio here...' },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  github: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  resume: { type: String },
  avatar: { type: String },
  yearsExperience: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
  timeline: [{
    year: String,
    title: String,
    company: String,
    description: String,
    type: { type: String, enum: ['work', 'education', 'achievement'], default: 'work' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
