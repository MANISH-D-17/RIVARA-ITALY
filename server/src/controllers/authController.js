import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

const adminEmail = 'manishishaa17@gmail.com';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const role = email === adminEmail ? 'admin' : 'customer';
  const user = await User.create({ name, email, password: hashed, role });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const googleAuth = async (req, res) => {
  const { email, name, googleId, avatar } = req.body;
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ name, email, googleId, avatar, role: email === adminEmail ? 'admin' : 'customer' });
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  res.json({ accessToken, refreshToken, user });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
    res.json({ accessToken: signAccessToken(user) });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
