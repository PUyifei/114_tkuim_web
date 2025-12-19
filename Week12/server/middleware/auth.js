// middlewares/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // 你的 Mongoose User model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * POST /auth/login
 * - 使用 email + password 登入
 * - 成功回傳 { token, user }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: '帳號或密碼錯誤' });


    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: '帳號或密碼錯誤' });


    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );


    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '系統錯誤，請稍後再試' });
  }
});

/**
 * authMiddleware
 * - 驗證 token
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '缺少授權資訊' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token 無效或已過期' });
  }
}

/**
 * requireRole
 * - 驗證角色
 */
export function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: '權限不足' });
    }
    next();
  };
}

export default router;
