const mongoose = require('mongoose');
module.exports = mongoose.model('Leave', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['casual', 'sick', 'earned', 'unpaid'], default: 'casual' },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }));
