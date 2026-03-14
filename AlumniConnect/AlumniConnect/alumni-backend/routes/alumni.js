const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const { protect } = require('../middleware/auth');

// GET /api/alumni — get all with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, branch, batch } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { role:    { $regex: search, $options: 'i' } },
      ];
    }
    if (branch && branch !== 'All') query.branch = branch;
    if (batch  && batch  !== 'All') query.batch  = batch;
    const alumni = await Alumni.find(query).sort({ createdAt: -1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/alumni/:id
router.get('/:id', async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/alumni — add new alumni
router.post('/', async (req, res) => {
  try {
    const { name, email, batch, branch, company, role, location, linkedin, skills, mentoring } = req.body;
    if (!name || !email || !batch || !branch)
      return res.status(400).json({ message: 'Name, email, batch and branch are required' });

    const exists = await Alumni.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Alumni with this email already exists' });

    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const alumni = await Alumni.create({
      name, email, batch, branch, company,
      role, location, linkedin, skills,
      mentoring, avatar: initials,
    });
    res.status(201).json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/alumni/:id — update (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/alumni/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
