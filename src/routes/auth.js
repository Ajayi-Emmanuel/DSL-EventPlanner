const express = require('express');
const authRouter = express.Router();
const User = require('../models/users')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');  

// Register User
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body; 

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ 
      message: 'User already exists',
      isSuccess: false
    });

    user = new User({ name, email, password });
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
});

// Login User
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
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
      isSuccess: true
    })
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      isSuccess: false
    })
  }
});

module.exports = authRouter;
