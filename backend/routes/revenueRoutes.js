// server/controllers/revenueController.js
const Revenue = require('../models/Revenue');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

router.get ('/',auth, async (req, res) => {
  try {
    const revenues = await Revenue.find();
    res.json(revenues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post ('/',auth, async (req, res) => {
  try {
    const newRevenue = new Revenue(req.body);
    const savedRevenue = await newRevenue.save();
    res.json(savedRevenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
