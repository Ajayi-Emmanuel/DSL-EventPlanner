const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
