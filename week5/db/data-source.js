const { DataSource } = require('typeorm')
const config = require('../config/index')

const CreditPackage = require('../entities/CreditPackages')//引入資料表
const Skill = require('../entities/Skill')
const User = require('../entities/User')
const Coach = require('../entities/Coach')
const Course = require('../entities/Course')

const dataSource = new DataSource({
  type: 'postgres',
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  synchronize: config.get('db.synchronize'),
  poolSize: 10,
  entities: [
    CreditPackage,
    Skill,
    User,
    Coach
  ],//記得在這引入資料表
  ssl: config.get('db.ssl')
})

// console.log("📌 檢查 Entities:", {
//   CreditPackage,
//   Skill,
//   User,
//   Coach,
//   Course
// });// 檢查是否有 `undefined` 的 entity

async function initializeDataSource() {
  try {
    console.log("🚀 嘗試初始化 DataSource...")
    await dataSource.initialize()
    console.log("✅ DataSource 初始化成功")
  } catch (error) {
    console.error("❌ DataSource 初始化失敗:", error)
    process.exit(1)
  }
}

initializeDataSource()

module.exports = { dataSource }
