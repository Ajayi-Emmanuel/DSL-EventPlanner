const userModel = require('../models/users')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: password23.
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the registration was successful
 *               example:
 *                 message: User registered successfully
 *                 isSuccess: true
 *       400:
 *         description: User already exists
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
 *              description: Indicates if the registration was successful
 *            example:
 *              message: User already exist 
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
 *              description: Indicates if the registration not successful
 *            example:
 *              message: Server error
 *              isSuccess: false
 
 */

exports.register_user = async (req, res) => {
  const { name, email, password } = req.body; 

  try {
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ 
      message: 'User already exists',
      isSuccess: false
    });

    user = new userModel({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'secretkey', { expiresIn: '1h' });

    res.status(200).json({ 
      message: "User registered successfully",
      isSuccess: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      isSuccess: false
    })
  }
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the login was successful
 *                 data:
 *                   type: string
 *                   description: JWT token
 *               example:
 *                 message: Login Successful
 *                 isSuccess: true
 *                 data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA0YjhmY2YzYTBhYjEzMDAzNDU2YjlhMyJ9LCJpYXQiOjE2MTY5Mjg5MDcsImV4cCI6MTY2OTI5NTB9"
 *       400:
 *         description: Invalid credentials
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
 *              description: Indicates if the login was successful
 *            example:
 *              message: Invalid Credentials 
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
 *              description: Indicates if the login was successful
 *            example:
 *              message: Server error
 *              isSuccess: false
 
 */
  exports.login_user = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) return res.status(400).json({ 
        message: 'Invalid Credentials',
        isSuccess: false
      });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ 
        message: 'Invalid Credentials',
        isSuccess: false
      });
  
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, 'secretkey', { expiresIn: '1h' });
  
      res.status(200).json({
        message: "Login Successful",
        isSuccess: true,
        data: token
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        isSuccess: false
      })
    }
}