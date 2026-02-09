import jwt from 'jsonwebtoken';

export const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
