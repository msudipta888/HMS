const express = require('express');
const User = require('../models/User');
// const Doctor = require('../models/Doctor');
// const Admin = require('../models/Admin'); // Add this line
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, role } = req.body;
  
  
  try {
    // Find user by both email AND role
    const user = await User.findOne({ email: email, role: role });
    
    // Check if user exists
    if (!user) {
      console.log('User not found or invalid role');
       return res.status(400).send({ error: 'Invalid email or role' });
    }else{
      console.log('user found:', user);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '24h' });
    res.send({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Server error' });
  }
});
module.exports = router;