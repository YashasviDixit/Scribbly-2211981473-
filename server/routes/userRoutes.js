const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('📝 Signup attempt:', email);

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ Email already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log('✅ Signup success:', newUser);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔑 Login Attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login success');
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

//  Test Ping Route
router.get('/ping', (req, res) => {
  res.send('✅ userRoutes is working!');
});

module.exports = router;