import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({
    $or: [{ email: email.toLowerCase() }, { username: email }]
  }).select('+passwordHash');

  if (!admin || !admin.isActive || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  return ok(res, {
    token,
    admin: { id: admin.id, email: admin.email, username: admin.username }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+passwordHash');

  if (!admin || !admin.isActive) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const matches = await admin.comparePassword(currentPassword);
  if (!matches) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();

  return res.json({ success: true, message: 'Password changed successfully' });
});
