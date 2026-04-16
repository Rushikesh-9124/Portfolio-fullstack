const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');

// GET /api/certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/certificates (protected)
router.post('/', protect, async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/certificates/:id (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/certificates/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
