const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'absent', 'half-day'], default: 'present' },
}, { timestamps: true });
s.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', s);
