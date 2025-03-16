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

module.exports = { dataSource }
