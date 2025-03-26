const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')
const admin = require('../controllers/admin')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
const isCoach = require('../middlewares/isCoach')

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 管理員與教練後台 API
 */

/**
 * @swagger
 * /api/admin/coaches/courses:
 *   post:
 *     summary: 建立教練課程
 *     tags: [Admin]
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
 *               description:
 *                 type: string
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               end_at:
 *                 type: string
 *                 format: date-time
 *               meeting_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: 課程建立成功
 *       400:
 *         description: 請填寫正確課程資訊
 */
router.post('/coaches/courses', auth, isCoach, admin.postCourse)

/**
 * @swagger
 * /api/admin/coaches/revenue:
 *   get:
 *     summary: 查詢教練收益統計
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得收益資料
 *       401:
 *         description: 未授權
 */
router.get('/coaches/revenue', auth, isCoach, admin.getCoachRevenue)

/**
 * @swagger
 * /api/admin/coaches/courses:
 *   get:
 *     summary: 查詢教練所有課程
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得課程列表
 *       401:
 *         description: 未授權
 */
router.get('/coaches/courses', auth, isCoach, admin.getCoachCourses)

/**
 * @swagger
 * /api/admin/coaches/courses/{courseId}:
 *   get:
 *     summary: 查詢特定課程資訊
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功取得課程資訊
 *       404:
 *         description: 找不到課程
 */
router.get('/coaches/courses/:courseId', auth, admin.getCoachCourseDetail)

/**
 * @swagger
 * /api/admin/coaches/courses/{courseId}:
 *   put:
 *     summary: 更新課程資訊
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               meeting_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: 課程更新成功
 *       400:
 *         description: 更新失敗或資料錯誤
 */
router.put('/coaches/courses/:courseId', auth, admin.putCoachCourseDetail)

/**
 * @swagger
 * /api/admin/coaches/{userId}:
 *   post:
 *     summary: 將使用者設定為教練
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               experience_years:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: 熱血健身教練，擁有多年帶課經驗
 *               profile_image_url:
 *                 type: string
 *                 example: https://example.com/image.png
 *             required:
 *               - experience_years
 *               - description
 *     responses:
 *       201:
 *         description: 已成功升級為教練
 *       404:
 *         description: 使用者不存在
 */
router.post('/coaches/:userId', admin.postCoach)

/**
 * @swagger
 * /api/admin/coaches:
 *   put:
 *     summary: 更新教練個人資料
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: 教練資料更新成功
 *       400:
 *         description: 格式錯誤或更新失敗
 */
router.put('/coaches', auth, isCoach, admin.putCoachProfile)

/**
 * @swagger
 * /api/admin/coaches:
 *   get:
 *     summary: 查詢教練個人資料
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得教練資料
 *       404:
 *         description: 找不到資料
 */
router.get('/coaches', auth, isCoach, admin.getCoachProfile)

module.exports = router
