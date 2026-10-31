const router = require('express').Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('hr'), async (req, res) => res.json(await User.find().populate('manager', 'name')));
router.get('/team', authorize('manager', 'hr'), async (req, res) =>
  res.json(await User.find({ manager: req.user._id })));

router.put('/me', async (req, res) => {
  const { name, phone, address } = req.body; // role/email/password not editable here
  res.json(await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true }));
});

router.put('/:id', authorize('hr'), async (req, res) => {
  const { name, role, department, manager } = req.body;
  res.json(await User.findByIdAndUpdate(req.params.id, { name, role, department, manager }, { new: true }));
});

router.delete('/:id', authorize('hr'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
