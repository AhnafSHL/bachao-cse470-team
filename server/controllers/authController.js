import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const ROLES = ['citizen', 'volunteer', 'admin'];

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  location: u.location,
});

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, location } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error('An account with that email already exists');
  }

  const safeRole = ROLES.includes(role) && role !== 'admin' ? role : 'citizen';

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone: phone || '',
    role: safeRole,
    location: location || {},
  });

  res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({ token: generateToken(user._id), user: publicUser(user) });
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

// @route PUT /api/auth/me
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, location } = req.body;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (location) user.location = { ...user.location, ...location };

  await user.save();
  res.json(publicUser(user));
});
