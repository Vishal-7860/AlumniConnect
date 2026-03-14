const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, date, location, type } = req.body;
    if (!title || !date || !location)
      return res.status(400).json({ message: 'Title, date and location are required' });
    const event = await Event.create({ title, date, location, type, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id/register (protected)
router.put('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.attendees.includes(req.user._id))
      return res.status(400).json({ message: 'Already registered' });
    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: 'Registered successfully', attendees: event.attendees.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
