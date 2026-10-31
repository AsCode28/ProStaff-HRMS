const router = require('express').Router();
const Leave = require('../models/Leave');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', async (req, res) => {
  const { type, from, to, reason } = req.body;
  if (new Date(to) < new Date(from)) return res.status(400).json({ message: 'Invalid date range' });
  res.status(201).json(await Leave.create({ user: req.user._id, type, from, to, reason }));
});

router.get('/me', async (req, res) => res.json(await Leave.find({ user: req.user._id }).sort('-createdAt')));

router.get('/pending', authorize('manager', 'hr'), async (req, res) => {
  const filter = req.user.role === 'hr' ? {} : { manager: req.user._id };
  const ids = (await User.find(filter).select('_id')).map((u) => u._id);
  res.json(await Leave.find({ user: { $in: ids }, status: 'pending' }).populate('user', 'name'));
});

router.put('/:id/status', authorize('manager', 'hr'), async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Bad status' });
  const leave = await Leave.findByIdAndUpdate(req.params.id, { status, reviewedBy: req.user._id }, { new: true });
  if (!leave) return res.status(404).json({ message: 'Not found' });
  await Notification.create({ user: leave.user, message: `Your leave was ${status}` });
  res.json(leave);
});

module.exports = router;
