const eventModel = require('../models/event');

exports.create_event = async (req, res) => {
    const { name, date, venue, spots } = req.body;
    try {
      const event = new eventModel({ name, date, venue, spots, createdBy: req.user.id });
      await event.save();
      res.status(201).json({
        message: "Event created successfully",
        data: event,
        isSuccess: true
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
};

exports.get_all_events = async (req, res) => {
    try {
      const events = await eventModel.find();
      res.json({
        message: "All your events retrieved",
        data: events,
        isSuccess: true
  
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
}

exports.get_event_by_id = async (req, res) => {
    try {
      const event = await eventModel.findById(req.params.id);
      if (!event) return res.status(404).json({ 
        message: 'Event not found',
        isSuccess: false 
      });
      res.json({
        message: "Event retrieved successfully",
        data: event,
        isSuccess: true
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
}

exports.update_event_by_id = async (req, res) => {
    try {
      let event = await eventModel.findById(req.params.id);
      if (!event) return res.status(404).json({ 
        message: 'Event not found',
        isSuccess: false 
      });
      
      updatedEvent = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({
        message: "Event updated successfully",
        data: updatedEvent,
        isSuccess: true
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
}

exports.delete_event_by_id = async (req, res) => {
    try {
     const deletedEvent = await eventModel.findByIdAndDelete(req.params.id);
      if (!deletedEvent) return res.status(404).json({ msg: 'Event not found' });
      res.status(200).json({ 
        message: 'Event deleted',
        isSuccess: true
      });
    
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
  }