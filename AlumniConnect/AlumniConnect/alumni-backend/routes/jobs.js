const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name batch').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, company, location, type, description } = req.body;
    if (!title || !company || !location)
      return res.status(400).json({ message: 'Title, company and location are required' });
    const job = await Job.create({ title, company, location, type, description, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
