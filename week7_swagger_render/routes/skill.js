const express = require('express')

/**
 * @swagger
 * tags:
 *   name: Skill
 *   description: 技能包相關 API
 */

const router = express.Router()
const skill = require('../controllers/skill')

/**
 * @swagger
 * /api/skill:
 *   get:
 *     summary: 取得所有技能包
 *     tags: [Skill]
 *     responses:
 *       200:
 *         description: 成功取得技能資料列表
 */
router.get('/', skill.getAll)

/**
 * @swagger
 * /api/skill:
 *   post:
 *     summary: 新增技能包
 *     tags: [Skill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: 新增成功，回傳技能資料
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     icon_url:
 *                       type: string
 *       400:
 *         description: 欄位未填寫正確 或 技能名稱重複
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
 *                   example: 技能名稱不可重複
 */
router.post('/', skill.post)

/**
 * @swagger
 * /api/skill/{skillId}:
 *   delete:
 *     summary: 刪除技能包
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 刪除成功
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
 *       404:
 *         description: 找不到技能資料
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
 *                   example: 找不到該技能
 */
router.delete('/:skillId', skill.deletePackage)

module.exports = router
