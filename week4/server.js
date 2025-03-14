require("dotenv").config()
const http = require("http")
const AppDataSource = require("./db")
//欄位資料型別驗證的3個function 也可以加上uuid的驗證，應該有套件 
function isUndefined (value) {
  return value === undefined
}
function isNotValidString (value) {
  return typeof value !== "string" || value.trim().length === 0 || value === ""
}
function isNotValidInteger (value){ 
  return typeof value !== "number" || value < 0 || value % 1 !== 0
}

const requestListener = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json"
  }
  let body = ""
  req.on("data", (chunk) => {
    body += chunk
  })
 // -------------------- CreditPackage 路由 --------------------
  if (req.url === "/api/credit-package" && req.method === "GET") {
    try {
      const packages = await AppDataSource.getRepository("CreditPackage").find({
        select: ["id","name","credit_amount","price"]
      })
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: "success",
        data: packages
      }))
      res.end()
    } catch (error) {
      res.writeHead(500, headers)
      res.write(JSON.stringify({
        status: "error",
        message: "伺服器錯誤"
      }))
      res.end()
    }
  } else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end", async () => {
      try{
      const data = JSON.parse(body)
      if(isUndefined(data.name) || isNotValidString(data.name) || 
            isUndefined(data.credit_amount) || isNotValidInteger(data.credit_amount) || 
            isUndefined(data.price) ||isNotValidInteger(data.price)){
          res.writeHead(400, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "欄位未填寫正確"
          }))
          res.end()
          return
        }
        const creditPackageRepo = await AppDataSource.getRepository("CreditPackage")
        const existPackage = await creditPackageRepo.find({
          where: {
            name: data.name
          }
        })
        if (existPackage.length > 0) {
          res.writeHead(409, headers)
          res.write(JSON.stringify({
            status : "failed",
            message: "資料重複"
          }))
          res.end()
          return
        }
        const newPackage = await creditPackageRepo.create({
          name: data.name,
          credit_amount:data.credit_amount,
          price:data.price
        })
        const result = await creditPackageRepo.save(newPackage)
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          status:"success",
          data: result
        }))
        res.end()
      } catch (error) {
        console.error(error)
        res.writeHead(500,headers)
        res.write(JSON.stringify({
          status: "error",
          message: "伺服器錯誤"
        }))
        res.end()
      }
    })
    
  } else if (req.url.startsWith("/api/credit-package/") && req.method === "DELETE") {
    try {
      const packageId = req.url.split("/").pop()//利用 split("/") 將 URL 分割成陣列，再用 pop() 取得最後一段作為 packageId
      if (isUndefined(packageId) || isNotValidString(packageId)) {
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))
        res.end()
        return
      }
      const result = await AppDataSource.getRepository("CreditPackage").delete(packageId)//使用 TypeORM 的 delete 方法從 "CreditPackage" 資料表中刪除該 packageId 對應的資料。
      //await 表示這是非同步操作，必須等待刪除完成。
      if (result.affected === 0) {//affected 是 TypeORM 在執行資料庫操作後，回傳受影響行數的屬性。在 delete 操作中，affected === 0 代表沒有找到符合條件的資料可刪除。result.affected === 0 表示沒有資料被刪除，可能是因為該 ID 不存在。
        //若無刪除成功，再次回傳 HTTP 400 並告訴使用者「ID錯誤」。
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))
        res.end()
        return
      }
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: "success"
      }))
      res.end()
    } catch (error) {
      console.error(error)
      res.writeHead(500, headers)
      res.write(JSON.stringify({
        status: "error",
        message: "伺服器錯誤"
      }))
      res.end()
    }
   // -------------------- Skill 路由 --------------------
  
  } else if (req.url === "/api/coaches/skill" && req.method === "GET") {
    try {
      const skills = await AppDataSource.getRepository("Skill").find({
        select: ["id","name","created_at"]
      })
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: "success",
        data: skills
      }))
      res.end()
    } catch (error) {
      res.writeHead(500, headers)
      res.write(JSON.stringify({
        status: "error",
        message: "伺服器錯誤"
      }))
      res.end()
    }
  } else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end", async () => {
      try{
      const data = JSON.parse(body)
      if(isUndefined(data.name) || isNotValidString(data.name) || 
            isUndefined(data.credit_amount) || isNotValidInteger(data.credit_amount) || 
            isUndefined(data.price) ||isNotValidInteger(data.price)){
          res.writeHead(400, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "欄位未填寫正確"
          }))
          res.end()
          return
        }
        const SkillRepo = await AppDataSource.getRepository("Skill")
        const existPackage = await SkillRepo.find({
          where: {
            name: data.name
          }
        })
        if (existPackage.length > 0) {
          res.writeHead(409, headers)
          res.write(JSON.stringify({
            status : "failed",
            message: "資料重複"
          }))
          res.end()
          return
        }
        const newPackage = await SkillRepo.create({
          name: data.name,
          credit_amount:data.credit_amount,
          price:data.price
        })
        const result = await SkillRepo.save(newPackage)
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          status:"success",
          data: result
        }))
        res.end()
      } catch (error) {
        console.error(error)
        res.writeHead(500,headers)
        res.write(JSON.stringify({
          status: "error",
          message: "伺服器錯誤"
        }))
        res.end()
      }
    })
    
  } else if (req.url.startsWith("/api/coaches/skill/") && req.method === "DELETE") {
    try {
      const skillId = req.url.split("/").pop()//利用 split("/") 將 URL 分割成陣列，再用 pop() 取得最後一段作為 skillId
      if (isUndefined(skillId) || isNotValidString(skillId)) {
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))
        res.end()
        return
      }
      const result = await AppDataSource.getRepository("Skill").delete(skillId)//使用 TypeORM 的 delete 方法從 "CreditPackage" 資料表中刪除該 packageId 對應的資料。
      //await 表示這是非同步操作，必須等待刪除完成。
      if (result.affected === 0) {//affected 是 TypeORM 在執行資料庫操作後，回傳受影響行數的屬性。在 delete 操作中，affected === 0 代表沒有找到符合條件的資料可刪除。result.affected === 0 表示沒有資料被刪除，可能是因為該 ID 不存在。
        //若無刪除成功，再次回傳 HTTP 400 並告訴使用者「ID錯誤」。
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))
        res.end()
        return
      }
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: "success"
      }))
      res.end()
    } catch (error) {
      console.error(error)
      res.writeHead(500, headers)
      res.write(JSON.stringify({
        status: "error",
        message: "伺服器錯誤"
      }))
      res.end()
    }
   // -------------------- 預檢請求處理 --------------------
  
  }else if (req.method === "OPTIONS") {//預檢請求 (CORS 用)處理 CORS (跨來源資源共享) 的 OPTIONS 請求。
    //瀏覽器在發送像 DELETE、PATCH 等非簡單請求時，會先發送 OPTIONS 預檢請求確認伺服器允許該操作。
    res.writeHead(200, headers)
    res.end()
    // -------------------- 無此路由 --------------------
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      status: "failed",
      message: "無此網站路由"
    }))
    res.end()
  }
}

const server = http.createServer(requestListener)

async function startServer () {
  await AppDataSource.initialize()
  console.log("資料庫連接成功")
  server.listen(process.env.PORT)
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`)
  return server;
}

module.exports = startServer();