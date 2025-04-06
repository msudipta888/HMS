// server/models/Billing.js
const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE'], default: 'PENDING' },
    dueDate: { type: Date, required: true },
    // Add other fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Billing', BillingSchema);
