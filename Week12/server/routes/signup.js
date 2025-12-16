const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const {
  findAll,
  findByOwner,
  findById,
  create,
  remove
} = require('../services/signupService');
const serializeParticipant = require('../serializers/participant');

/**
 * 所有 /api/signup 子路由都必須登入
 */
router.use(authMiddleware);

/**
 * GET /api/signup
 * - admin：可看全部
 * - student：只能看自己的
 */
router.get('/', async (req, res, next) => {
  try {
    const data =
      req.user.role === 'admin'
        ? await findAll()
        : await findByOwner(req.user.id);

    res.json({
      total: data.length,
      data: data.map(serializeParticipant)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/signup
 * - 登入者才能新增
 * - ownerId 一律使用 req.user.id
 */
router.post('/', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      ownerId: req.user.id
    };

    const created = await create(payload);

    res.status(201).json(serializeParticipant(created));
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/signup/:id
 * - 找不到 → 404
 * - 非本人且非 admin → 403
 * - 通過 → 刪除 + 回傳成功訊息
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const record = await findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: '資料不存在' });
    }

    const isOwner = record.ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: '沒有權限刪除此資料' });
    }

    await remove(req.params.id);

    res.json({ message: '刪除完成' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
