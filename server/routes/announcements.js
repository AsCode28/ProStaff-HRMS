const router = require('express').Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', async (req, res) => res.json(await Announcement.find().sort('-createdAt').populate('createdBy', 'name')));
router.post('/', authorize('hr', 'manager'), async (req, res) =>
  res.status(201).json(await Announcement.create({ ...req.body, createdBy: req.user._id })));

module.exports = router;
