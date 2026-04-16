const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'AI/ML', 'Database', 'DevOps', 'Language', 'Other']
  },
  level: { type: Number, min: 0, max: 100, default: 75 },
  icon: { type: String },
  color: { type: String, default: '#6366f1' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
