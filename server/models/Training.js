const mongoose = require('mongoose');
module.exports = mongoose.model('Training', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }));
