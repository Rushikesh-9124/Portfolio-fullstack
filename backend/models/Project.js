const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String, trim: true }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ['Web App', 'Mobile', 'AI/ML', 'API', 'Other'],
    default: 'Web App'
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'archived'],
    default: 'completed'
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
