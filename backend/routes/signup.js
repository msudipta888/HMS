const express = require('express');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');

const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, email, password,specialization,phoneNumber,licenseNumber,role } = req.body;

  console.log('Received data:', req.body); // Add this line to log the request body

  try {
    const user = new User({ firstName, lastName, email, password, role });
    if(role==="admin"){
      await Admin.create({ firstName, lastName, email, password, role });
      console.log('Admiin created')
    }else if(role === "doctor"){
      await Doctor.create({firstName,lastName,email,password,specialty:specialization,licenseNumber,phoneNumber,role});
    }
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: 'Email already exists' });
    }
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
