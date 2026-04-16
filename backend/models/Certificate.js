const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true },
  date: { type: String },
  credentialId: { type: String },
  credentialUrl: { type: String },
  image: { type: String },
  category: { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
