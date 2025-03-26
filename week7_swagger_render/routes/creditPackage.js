const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const creditPackage = require('../controllers/creditPackage')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

/**
 * @swagger
 * tags:
 *   name: CreditPackage
 *   description: 方案相關 API
 */

/**
 * @swagger
 * /api/credit-package:
 *   get:
 *     summary: 查詢所有方案
 *     tags: [CreditPackage]
 *     responses:
 *       200:
 *         description: 成功取得所有方案
 */
router.get('/', creditPackage.getAll)

/**
 * @swagger
 * /api/credit-package:
 *   post:
 *     summary: 建立新方案
 *     tags: [CreditPackage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               credit:
 *                 type: integer
 *               price:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 方案建立成功
 *       400:
 *         description: 欄位錯誤或建立失敗
 */
router.post('/', creditPackage.post)

/**
 * @swagger
 * /api/credit-package/{creditPackageId}:
 *   post:
 *     summary: 購買方案
 *     tags: [CreditPackage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: creditPackageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: 購買成功
 *       404:
 *         description: 找不到指定方案
 *       400:
 *         description: 購買失敗，可能是 ID 錯誤 或 已購買過該方案
 */
router.post('/:creditPackageId', auth, creditPackage.postUserBuy)

/**
 * @swagger
 * /api/credit-package/{creditPackageId}:
 *   delete:
 *     summary: 刪除方案
 *     tags: [CreditPackage]
 *     parameters:
 *       - in: path
 *         name: creditPackageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 找不到指定方案
 */
router.delete('/:creditPackageId', creditPackage.deletePackage)

module.exports = router
