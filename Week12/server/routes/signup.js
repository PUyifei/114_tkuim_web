// server.js
import express from 'express';
import authRoutes from './middlewares/auth.js';
import signupRoutes from './routes/signup.js';

const app = express();

// 解析 JSON
app.use(express.json());

// 登入路由
app.use('/auth', authRoutes);

// 報名表單 API
app.use('/api/signup', signupRoutes);

// 全域錯誤處理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '伺服器錯誤' });
});

// 啟動 server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
