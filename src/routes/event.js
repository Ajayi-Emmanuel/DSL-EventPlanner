const express = require('express');
const eventRouter = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/event');

// Create Event
eventRouter.post('/', auth, async (req, res) => {
  const { name, date, venue, spots } = req.body;
  try {
    const event = new Event({ name, date, venue, spots, createdBy: req.user.id });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get All Events
eventRouter.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get Single Event by ID
eventRouter.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update Event
eventRouter.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete Event
eventRouter.delete('/:id', auth, async (req, res) => {
  try {
   const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ msg: 'Event not found' });
    res.json({ msg: 'Event deleted' });
  
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = eventRouter;
