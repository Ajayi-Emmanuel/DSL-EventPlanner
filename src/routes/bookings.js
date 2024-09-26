const express = require('express');
const bookingRouter = express.Router();
const auth = require('../middleware/auth');
const bookingModel = require('../models/booking');
const eventModel = require('../models/event');

// Book an Event
bookingRouter.post('/:eventId', auth, async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.eventId);
    if (!event) return res.status(404).json({ 
      message: 'Event not found',
      isSuccess: false
    });

    if (event.spots <= 0) return res.status(400).json({ message: 'No spots available' , isSuccess: false});

    const booking = new bookingModel({ event: event.id, user: req.user.id });
    await booking.save();

    // Update spots available
    event.spots -= 1;
    await event.save();

    res.status(200).json({ 
      message: 'Booking confirmed', 
      data: booking,
      isSuccess: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      isSuccess: false
    })
  }
});

module.exports = bookingRouter;
