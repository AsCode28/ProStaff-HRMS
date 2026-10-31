const router = require('express').Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
const today = () => new Date().toISOString().slice(0, 10);

router.post('/checkin', async (req, res) => {
  try {
    const rec = await Attendance.create({ user: req.user._id, date: today(), checkIn: new Date() });
    res.status(201).json(rec);
  } catch { res.status(400).json({ message: 'Already checked in today' }); }
});

router.post('/checkout', async (req, res) => {
  const rec = await Attendance.findOneAndUpdate(
    { user: req.user._id, date: today() }, { checkOut: new Date() }, { new: true });
  if (!rec) return res.status(400).json({ message: 'Check in first' });
  res.json(rec);
});

router.get('/me', async (req, res) =>
  res.json(await Attendance.find({ user: req.user._id }).sort('-date')));

router.get('/team', authorize('manager', 'hr'), async (req, res) => {
  const filter = req.user.role === 'hr' ? {} : { manager: req.user._id };
  const ids = (await User.find(filter).select('_id')).map((u) => u._id);
  res.json(await Attendance.find({ user: { $in: ids } }).populate('user', 'name').sort('-date'));
});

module.exports = router;
