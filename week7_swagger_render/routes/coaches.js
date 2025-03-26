const express = require('express')

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: 查詢教練與課程資訊 API
 */

const router = express.Router()
const coaches = require('../controllers/coaches')

/**
 * @swagger
 * /api/coaches:
 *   get:
 *     summary: 取得所有教練列表
 *     tags: [Coaches]
 *     responses:
 *       200:
 *         description: 成功回傳教練清單
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
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       experience_years:
 *                         type: integer
 *                       description:
 *                         type: string
 *                       profile_image_url:
 *                         type: string
 */

router.get('/', coaches.getCoaches)

/**
 * @swagger
 * /api/coaches/{coachId}:
 *   get:
 *     summary: 查詢單一教練個人資料
 *     tags: [Coaches]
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功取得教練資訊
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
 *                         role:
 *                           type: string
 *                     coach:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         user_id:
 *                           type: integer
 *                         experience_years:
 *                           type: integer
 *                         description:
 *                           type: string
 *                         profile_image_url:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 欄位未填寫正確 或 找不到該教練
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: 找不到該教練
 */

router.get('/:coachId', coaches.getCoachDetail)

/**
 * @swagger
 * /api/coaches/{coachId}/courses:
 *   get:
 *     summary: 查詢教練課程列表
 *     tags: [Coaches]
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功取得課程清單
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
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       start_at:
 *                         type: string
 *                         format: date-time
 *                       end_at:
 *                         type: string
 *                         format: date-time
 *                       max_participants:
 *                         type: integer
 *                       coach_name:
 *                         type: string
 *                       skill_name:
 *                         type: string
 *       400:
 *         description: 欄位未填寫正確 或 找不到教練課程
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: 找不到該教練
 */

router.get('/:coachId/courses', coaches.getCoachCourses)

module.exports = router
