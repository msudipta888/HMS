// server/models/Revenue.js
const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    // e.g. daily revenue, monthly revenue, or a tag for period
    type: { type: String, default: 'daily' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Revenue', RevenueSchema);
