const eventModel = require('../models/event');


/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - venue
 *         - spots
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the event
 *         venue:
 *           type: string
 *           description: The location of the event
 *         spots:
 *           type: number
 *           description: Number of available spots for the event
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the event
 *       example:
 *         id: d5fE_asz
 *         name: Developer Conference 2024
 *         date: 2024-10-15T10:30:00.000Z
 *         venue: New York Convention Center
 *         spots: 200
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Event already exists
 *       500:
 *         description: Server error
 */
exports.create_event = async (req, res) => {
    const { name, date, venue, spots } = req.body;
    // check if event already exists
    const eventExists = await eventModel.findOne({ name });
    if(eventExists) return res.status(400).json({
      message: "Event already exists",
      isSuccess: false
    });

    try {
      const event = await eventModel.create({ name, date, venue, spots });

      res.status(201).json({
        message: "Event created successfully",
        data: event,
        isSuccess: true
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
};

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/events/my-events:
 *    get:
 *     summary: Retrieve all events created by the current user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       200:
 *         description: A list of events created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
exports.get_all_events_by_creator = async (req, res) => {
    try {
      const events = await eventModel.find({ createdBy: req.user.id });
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

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Retrieve a single event by its ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: The event description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: User not authorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
exports.update_event_by_id = async (req, res) => {
    try {
      let event = await eventModel.findById(req.params.id);
      if (!event) return res.status(404).json({ 
        message: 'Event not found',
        isSuccess: false 
      });
      
      // update event only if the user is the creator
      if (event.createdBy.toString() !== req.user.id) {
        return res.status(401).json({ 
          message: 'User not authorized',
          isSuccess: false 
        });
      }

      const updatedEvent = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({
        message: "Event updated successfully",
        data: updatedEvent,
        isSuccess: true
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
}

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: The event was deleted
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
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