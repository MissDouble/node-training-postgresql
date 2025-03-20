const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('User')
const { isUndefined, isNotValidString, isValidPassword } = require('../utils/validUtils')
const isAuth = require('../middleware/isAuth')
const appError = require('../utils/appError')
const { generateJWT } = require('../utils/jwtUtils')

router.post('/signup', async(req,res,next)=>{
    try {
        const data = req.body
        
        console.log("🔍 密碼:", data.password); // 檢查是否正確傳入

        if(isUndefined(data.name)||isNotValidString(data.name)||
            isUndefined(data.email)||isNotValidString(data.email)||
            isUndefined(data.password)||isNotValidString(data.password)){
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確"
            })
            return
        }
        if(!isValidPassword(data.password)){
            res.status(400).json({
                status: "failed",
                message: "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
            })
            return
        }
        const userRepo = await dataSource.getRepository('User')
        const findUser = await userRepo.findOne({//只有查找一筆資料用findOne
            where:{//這邊where也可以下select，
                email:data.email
            }
        })
        if(findUser){
            res.status(409).json({
                status:"failed",
                message:"Email已被使用"
            })
            return
        }
        const hashPassword = await bcrypt.hash(data.password, saltRounds)
        const newUser = await userRepo.create({
            name:data.name,
            email:data.email,
            password:hashPassword,
            role:'USER'
        })
        const result = await userRepo.save(newUser)
        res.status(201).json({
            status: "success",
            data: {
                user:{
                    id:result.id,
                    name:result.name
                }
        }
    })
    } catch (error) {
        logger.error(error)
       next(error) ;
    }
})
router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (isNotValidString(email) ||isNotValidString(password)) {
        res.status(400).json({
          status: 'failed',
          message: '欄位未填寫正確'
        })
        return
      }
      if(!isValidPassword(password)) {
        res.status(400).json({
          status: 'failed',
          message: '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'
        })
        return
      }
  
      
      const userRepo = dataSource.getRepository('User')
      // 使用者不存在或密碼輸入錯誤
      const findUser = await userRepo.findOne({
          select:['id','name','password'],
          where:{
              email:email
          }
      })
      if(!findUser){
          next(appError(400, '使用者不存在或密碼輸入錯誤'))
          return
      }
      
      const isMatch = await bcrypt.compare(password, findUser.password)
      if(!isMatch){
          next(appError(400, '使用者不存在或密碼輸入錯誤'))
          return
      }
      // TODO JWT
      const token = generateJWT({
          id:findUser.id,
          role:findUser.role
      })
  
      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            name: findUser.name
          }
        }
      })
    } catch (error) {
      logger.error('登入錯誤:', error)
      next(error)
    }
})
router.get('/profile', isAuth, async (req, res, next) => {
    try {
      const { id } = req.user//從isAuth.js來的
      if(isNotValidString(id)){
        next(appError(400,'欄位未填寫正確'))
      }
      const findUser = await dataSource.getRepository('User').findOne({
        where:{id}
      })
      
      res.status(200).json({
        status: 'success',
        data: {
          email: findUser.email,
          name: findUser.name
        }
      })
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error)
      next(error)
    }
  })
router.put('/profile', isAuth, async(req,res,next)=>{
try {
    const {id} =req.user
    const {name} = req.body
    if(isNotValidString(name)){
        next(appError(400,'欄位未填寫正確'))
        return
    }
    const userRepo = dataSource.getRepository('User')
    //TODO 檢查使用者名稱未變更
    const findUser = await userRepo.findOne({
        select:['name','email'],
        where: {id}
    })
    if(findUser.name === name){
        next(appError(400,'檢查使用者名稱未變更'))
        return
    }
    findUser.name = name;
    const updateUser = await userRepo.save({
        id,//條件
        name: findUser.name,
        email:findUser.email
    },{
        name//欄位
    })
    if(updateUser.affected === 0 ){
        next(appError(400,'更新使用者失敗'))
    }
    res.status(200).json({
      status:'success',
      data:{
        user: updateUser
      }
    })

} catch (error) {
    next(error)
}
})
module.exports = router