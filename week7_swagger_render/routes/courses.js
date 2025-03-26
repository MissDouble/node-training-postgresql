const express = require('express')
const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Courses')
const courses = require('../controllers/courses')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: 課程預約相關 API
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: 取得所有課程
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: 成功取得課程清單
 */
router.get('/', courses.getAllCourses)

/**
 * @swagger
 * /api/courses/{courseId}:
 *   post:
 *     summary: 預約課程
 *     tags: [Courses]
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
 *       201:
 *         description: 預約成功
 *       400:
 *         description: ID錯誤、已經報名過此課程 或 已無可使用堂數
 */
router.post('/:courseId', auth, courses.postCourseBooking)

/**
 * @swagger
 * /api/courses/{courseId}:
 *   delete:
 *     summary: 取消課程預約
 *     tags: [Courses]
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
 *         description: 取消成功
 *       404:
 *         description: ID錯誤 或 取消失敗
 */
router.delete('/:courseId', auth, courses.deleteCourseBooking)

module.exports = router
