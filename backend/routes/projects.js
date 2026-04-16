const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (req.body.techStack) {
      req.body.techStack = JSON.parse(req.body.techStack);
    }

    const project = await Project.create({
      ...req.body,
      image: req.file?.path // ✅ Cloudinary URL
    });

    res.status(201).json({ success: true, data: project });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    if (req.body.techStack) {
      req.body.techStack = JSON.parse(req.body.techStack);
    }

    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: project });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;