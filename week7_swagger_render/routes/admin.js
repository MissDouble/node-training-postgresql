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
 *               coach_id:
 *                 type: string
 *                 format: uuid
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
 *               max_participants:
 *                 type: integer
 *               skill_id:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - coach_id
 *               - name
 *               - description
 *               - start_at
 *               - end_at
 *               - meeting_url
 *               - max_participants
 *               - skill_id
 *     responses:
 *       201:
 *         description: 課程建立成功
 *       400:
 *         description: 課程建立失敗，請確認欄位是否填寫正確
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
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           enum: [january, february, march, april, may, june, july, august, september, october, november, december]
 *           example: january
 *         description: 要查詢的月份（英文小寫）
 *     responses:
 *       200:
 *         description: 成功取得收益資料
 *       401:
 *         description: 使用者非教練身分或未登入
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
 *         description: 使用者非教練身分或未登入
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
 *         description: 查無此課程
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
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               end_at:
 *                 type: string
 *                 format: date-time
 *               max_participants:
 *                 type: integer
 *               skill_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: 課程更新成功
 *       400:
 *         description: 更新失敗，請確認欄位是否填寫正確
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
 *         description: 查無此使用者
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
 *               experience_years:
 *                 type: integer
 *               description:
 *                 type: string
 *               profile_image_url:
 *                 type: string
 *             required:
 *               - experience_years
 *               - description
 *     responses:
 *       200:
 *         description: 教練資料更新成功
 *       400:
 *         description: 請確認格式是否正確或教練不存在
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
 *         description: 查無此教練
 */
router.get('/coaches', auth, isCoach, admin.getCoachProfile)

module.exports = router
