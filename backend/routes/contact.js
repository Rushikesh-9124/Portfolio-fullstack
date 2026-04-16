const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// POST /api/contact
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contact (protected)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/contact/:id/read (protected)
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/contact/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
