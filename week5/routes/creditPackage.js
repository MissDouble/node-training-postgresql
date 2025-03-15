const express = require('express')
const router = express.Router()
console.log(router)
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isUndefined, isNotValidInteger,isNotValidString } = require('../utils/validUtils')

router.get('/', async (req, res, next) => {
    try {
        const packages = await dataSource.getRepository("CreditPackage").find({//上週叫做AppDataSource，這週改叫DataSource，要記得改
          select: ["id","name","credit_amount","price"]
        })
        res.status(200).json({
            status: "success",
            data: packages
        })
        // res.writeHead(200, headers)
        // res.write(JSON.stringify({
        //   status: "success",
        //   data: packages
        // }))
        // res.end()
      } catch (error) {
        // res.writeHead(500, headers)
        // res.write(JSON.stringify({
        //   status: "error",
        //   message: "伺服器錯誤"
        // }))
        // res.end()
        next(error)
      }
})

router.post('/', async (req, res, next) => {
    try{
        const data = req.body
        if(isUndefined(data.name) || isNotValidString(data.name) || 
              isUndefined(data.credit_amount) || isNotValidInteger(data.credit_amount) || 
              isUndefined(data.price) ||isNotValidInteger(data.price)){
            // res.writeHead(400, headers)
            // res.write(JSON.stringify({
            //   status: "failed",
            //   message: "欄位未填寫正確"
            // }))
            // res.end()
            // return
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確"
            })
          }
          const creditPackageRepo = await dataSource.getRepository("CreditPackage")
          const existPackage = await creditPackageRepo.find({
            where: {
              name: data.name
            }
          })
          if (existPackage.length > 0) {
            // res.writeHead(409, headers)
            // res.write(JSON.stringify({
            //   status : "failed",
            //   message: "資料重複"
            // }))
            // res.end()
            // return
            res.status(409).json({
                status: "failed",
                message: "資料重複"
            })
          }
          const newPackage = await creditPackageRepo.create({
            name: data.name,
            credit_amount:data.credit_amount,
            price:data.price
          })
          const result = await creditPackageRepo.save(newPackage)
        //   res.writeHead(200, headers)
        //   res.write(JSON.stringify({
        //     status:"success",
        //     data: result
        //   }))
        //   res.end()
        res.status(200).json({
            status:"success",
            data: result
        })
        } catch (error) {
        //   console.error(error)
        //   res.writeHead(500,headers)
        //   res.write(JSON.stringify({
        //     status: "error",
        //     message: "伺服器錯誤"
        //   }))
        //   res.end()
        next(error)
        }
})

router.delete('/:creditPackageId', async (req, res, next) => {
    try {
        const { creditPackageId } = req.params
        // const packageId = req.url.split("/").pop()//利用 split("/") 將 URL 分割成陣列，再用 pop() 取得最後一段作為 packageId
        if (isUndefined(creditPackageId) || isNotValidString(creditPackageId)) {
            res.status(400).json({
                status: "failed",
                message: "ID錯誤"
            })
        //   res.writeHead(400, headers)
        //   res.write(JSON.stringify({
        //     status: "failed",
        //     message: "ID錯誤"
        //   }))
        //   res.end()
        //   return
        }
        const result = await dataSource.getRepository("CreditPackage").delete(packageId)//使用 TypeORM 的 delete 方法從 "CreditPackage" 資料表中刪除該 packageId 對應的資料。
        //await 表示這是非同步操作，必須等待刪除完成。
        if (result.affected === 0) {//affected 是 TypeORM 在執行資料庫操作後，回傳受影響行數的屬性。在 delete 操作中，affected === 0 代表沒有找到符合條件的資料可刪除。result.affected === 0 表示沒有資料被刪除，可能是因為該 ID 不存在。
          //若無刪除成功，再次回傳 HTTP 400 並告訴使用者「ID錯誤」。
          res.status(400).json({
            status: "failed",
            message: "ID錯誤"
          })
        //   res.writeHead(400, headers)
        //   res.write(JSON.stringify({
        //     status: "failed",
        //     message: "ID錯誤"
        //   }))
        //   res.end()
        //   return
        }
        res.status(200).json({
            status: "success"
        })
        // res.writeHead(200, headers)
        // res.write(JSON.stringify({
        //   status: "success"
        // }))
        // res.end()
      } catch (error) {
        // console.error(error)
        // res.writeHead(500, headers)
        // res.write(JSON.stringify({
        //   status: "error",
        //   message: "伺服器錯誤"
        // }))
        // res.end()
        next(error);
      }
})

module.exports = router
