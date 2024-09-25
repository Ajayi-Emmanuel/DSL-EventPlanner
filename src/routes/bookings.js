const express = require('express');
const bookingRouter = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/booking');
const Event = require('../models/event');

// Book an Event
bookingRouter.post('/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.spots <= 0) return res.status(400).json({ msg: 'No spots available' });

    const booking = new Booking({ event: event.id, user: req.user.id });
    await booking.save();

    // Update spots available
    event.spots -= 1;
    await event.save();

    res.json({ msg: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = bookingRouter;
