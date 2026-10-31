const router = require('express').Router();
const Training = require('../models/Training');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', async (req, res) => res.json(await Training.find().sort('date')));
router.post('/', authorize('hr', 'manager'), async (req, res) =>
  res.status(201).json(await Training.create({ ...req.body, createdBy: req.user._id })));
router.post('/:id/enroll', async (req, res) =>
  res.json(await Training.findByIdAndUpdate(req.params.id, { $addToSet: { participants: req.user._id } }, { new: true })));

module.exports = router;
