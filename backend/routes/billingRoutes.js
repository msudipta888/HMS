// server/controllers/billingController.js
const Billing = require('../models/Billing');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Get all bills
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

router.get  ('/',auth, async ( req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new bill
router.post ('/',auth, async (req, res) => {
  try {
    const newBill = new Billing(req.body);
    const savedBill = await newBill.save();
    res.json(savedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a bill
router.put ('/:id',auth, async (req, res) => {
  try {
    const updatedBill = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a bill
router.delete ('/:id',auth, async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;