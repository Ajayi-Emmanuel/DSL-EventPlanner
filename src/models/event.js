const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  venue: { 
    type: String, 
    required: true 
  },
  spots: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    required: false 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
});

module.exports = mongoose.model('Event', eventSchema);
