// server/models/InsuranceClaim.js
const mongoose = require('mongoose');

const InsuranceClaimSchema = new mongoose.Schema(
  {
    claimNumber: { type: String, required: true },
    policyHolder: { type: String, required: true },
    status: { type: String, enum: ['SUBMITTED', 'APPROVED', 'PENDING'], default: 'SUBMITTED' },
    // Additional fields: e.g. claimAmount, dateSubmitted, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsuranceClaim', InsuranceClaimSchema);
