// server/controllers/insuranceController.js
const InsuranceClaim = require('../models/InsuranceClaim');
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

router.get('/',auth, async (req, res) => {
  try {
    const claims = await InsuranceClaim.find();
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post ('/',auth, async (req, res) => {
  try {
    const newClaim = new InsuranceClaim(req.body);
    const savedClaim = await newClaim.save();
    res.json(savedClaim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put ('/:id',auth, async (req, res) => {
  try {
    const updatedClaim = await InsuranceClaim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClaim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete ('/:id',auth, async (req, res) => {
  try {
    await InsuranceClaim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Claim deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;