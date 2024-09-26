const bookingRouter = require('express').Router()
const auth = require('../middleware/auth');
const bookingController = require("../controllers/bookings.controllers");

// Book an Event
bookingRouter.post('/:eventId', auth, bookingController.book_event);

module.exports = bookingRouter;
