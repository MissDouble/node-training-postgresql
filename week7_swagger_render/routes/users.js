const express = require('express')
const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Users')
const users = require('../controllers/users')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *   name: Admin
 *   description: 使用者相關 API
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: 使用者註冊
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 新建立的使用者 ID 回傳
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: 王小明
 *       400:
 *         description: 欄位未填寫正確 或 密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字
 *       409:
 *         description: Email 已被使用
 */
router.post('/signup', users.postSignup)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 使用者登入
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 登入成功，回傳 token 與使用者名稱
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR...
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: 王小明
 *       400:
 *         description: 欄位未填寫正確 或 密碼不符合規則 或 使用者不存在或密碼輸入錯誤
 */
router.post('/login', users.postLogin)

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 取得使用者個人資料
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 回傳使用者名稱與 email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: 王小明
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *       401:
 *         description: 未授權
 */
router.get('/profile', auth, users.getProfile)

/**
 * @swagger
 * /api/users/credit-package:
 *   get:
 *     summary: 取得使用者已購買的方案列表
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 回傳 CreditPackage 購買紀錄
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 黃金會員包
 *                       purchased_credits:
 *                         type: integer
 *                         example: 30
 *                       price_paid:
 *                         type: integer
 *                         example: 1500
 *                       purchase_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-03-01T12:00:00Z
 *       401:
 *         description: 未授權
 */
router.get('/credit-package', auth, users.getCreditPackage)

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: 修改使用者名稱
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: 回傳修改後的名稱
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: 王小明
 *       400:
 *         description: 欄位未填寫正確 或 使用者名稱未變更 或 更新使用者資料失敗
 *       401:
 *         description: 未授權
 */
router.put('/profile', auth, users.putProfile)

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: 修改使用者密碼
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               new_password:
 *                 type: string
 *               confirm_new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 密碼更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: 欄位未填寫正確 或 密碼不符合規則 或 新密碼不能與舊密碼相同 或 新密碼與驗證新密碼不一致 或 密碼輸入錯誤 或 更新密碼失敗
 *       401:
 *         description: 未授權
 */
router.put('/password', auth, users.putPassword)

/**
 * @swagger
 * /api/users/courses:
 *   get:
 *     summary: 取得使用者課程預約紀錄
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 回傳剩餘點數與預約課程清單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     credit_remain:
 *                       type: integer
 *                       example: 10
 *                     credit_usage:
 *                       type: integer
 *                       example: 5
 *                     course_booking:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           course_id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: 肌力訓練
 *                           start_at:
 *                             type: string
 *                             format: date-time
 *                           end_at:
 *                             type: string
 *                             format: date-time
 *                           meeting_url:
 *                             type: string
 *                             example: https://meet.example.com/abc
 *                           coach_name:
 *                             type: string
 *                             example: 教練阿強
 *       401:
 *         description: 未授權
 */
router.get('/courses', auth, users.getCourseBooking)

module.exports = router
