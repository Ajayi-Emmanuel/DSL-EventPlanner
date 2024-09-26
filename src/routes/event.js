const express = require('express');
const eventRouter = express.Router();
const eventController = require("../controllers/event.controllers")
const auth = require('../middleware/auth');

// Create Event
eventRouter.post('/', auth, eventController.create_event)

// Get All Events
eventRouter.get('/', eventController.get_all_events);

// Get all events posted by a user

// Get Single Event by ID
eventRouter.get('/:id', eventController.get_event_by_id);

// Update Event
eventRouter.put('/:id', auth, eventController.update_event_by_id);

// Delete Event
eventRouter.delete('/:id', auth, eventController.delete_event_by_id);

module.exports = eventRouter;
