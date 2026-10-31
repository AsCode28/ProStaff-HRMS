const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

router.post('/register',
  body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errs = validationResult(req);
      if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
      const { name, email, password, department } = req.body;
      if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already used' });
      // First account becomes HR admin; everyone else is an employee
      const role = (await User.countDocuments()) === 0 ? 'hr' : 'employee';
      const user = await User.create({ name, email, password, department, role });
      res.status(201).json({ token: sign(user._id), user: { id: user._id, name, email, role } });
    } catch (e) { next(e); }
  });

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
