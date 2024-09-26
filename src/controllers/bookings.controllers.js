const bookingModel = require('../models/booking');
const eventModel = require('../models/event');


/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - event
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the booking
 *         event:
 *           type: string
 *           description: The ID of the event being booked
 *         user:
 *           type: string
 *           description: The ID of the user making the booking
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the booking was created
 *       example:
 *         id: abc123
 *         event: 605c72a2a74c1f1f28e7d734
 *         user: 605c72a2a74c1f1f28e7d123
 *         createdAt: 2024-09-26T12:34:56.789Z
 */

/**
 * @swagger
 * /events/{eventId}:
 *   post:
 *     summary: Book a spot in an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to be booked
 *     responses:
 *       200:
 *         description: Booking confirmed
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: The success message
 *                data:
 *                 $ref: '#/components/schemas/Booking'
 *                isSuccess:
 *                 type: boolean
 *                 description: Indicates if event could be booked
 *              example:
 *               message: Booking confirmed
 *               data:
 *                id: abc123
 *                event: 605c72a2a74c1f1f28e7d734
 *                user: 605c72a2a74c1f1f28e7d123
 *                createdAt: 2024-09-26T12:34:56.789Z
 *               isSuccess: true
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *           schema:
 *           type: object
 *           properties:
 *            message:
 *              type: string
 *              description: The error message
 *            isSuccess:
 *             type: boolean
 *             description: Indicates if event could be booked
 *           example:
 *             message: Unauthorized
 *             isSuccess: false
 *       400:
 *         description: No spots available
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string 
 *              description: The error message
 *             isSuccess:
 *              type: boolean
 *              description: Indicates if event could be booked
 *            example:
 *              message: No spots available
 *              isSuccess: false
 *       500:
 *         description: Server error
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string 
 *              description: The error message
 *             isSuccess:
 *              type: boolean
 *              description: Indicates if event could be booked
 *            example:
 *              message: Server error
 *              isSuccess: false
 *       404:
  *         description: Event not found
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string 
 *              description: The error message
 *             isSuccess:
 *              type: boolean
 *              description: Indicates if an event was found
 *            example:
 *              message: Event not found
 *              isSuccess: false
 */
exports.book_event = async (req, res) => {
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
}