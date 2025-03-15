const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('admin')
const { isUndefined, isNotValidString, isValidPassword } = require('../utils/validUtils')

router.post('/coaches/:userId', async(req,res,next)=> {
    try {
        const { userId } = req.params
        const { experience_years, description, profile_image_url} = req.body
        if(!isNotValidString(userId) || !isNumber(experience_years) || !isNotValidString(description)){
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確",
              })
            return
        }
        if(profile_image_url && isNotValidString(profile_image_url) && !profile_image_url.starsWith('https')){//因為非必填欄位 所以分開做檢查
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確",
              })
              return
        }
        const userRepo = dataSource.getRepository('User')
        const findUser = userRepo.findOne({
            where:{
                id:userId
            }
        })
        if(!findUser){
            res.status(400).json({
                status: "failed",
                message: "使用者不存在",
              })
              return
        }
        const updateUser = userRepo.update({
            id:userId
        },{
            role: 'COACH'
        })
        if(updateUser.affected === 0){
            res.status(400).json({
                status: "failed",
                message: "更新使用者失敗",
              })
              return
        }else if(findUser.role === "COACH"){
            res.status(400).json({
                status: "failed",
                message: "使用者已經是教練",
              })
        }
        const coachRepo = dataSource.getRepository('Coach')
        const newCoach = coachRepo.create({//create不用加 因為建立資料 但還沒存到db
            user_id: userId,
            description,
            profile_image_url,
            experience_years,
        })
        const coachResult = await coachRepo.save(newCoach)//正式存入 要加
        const userResult = await userRepo.findOne({//要撈資料庫的行為就要加await
            where:{
                id:userId
            }
        })
        res.status(201).json({
            status: "success",
            data: {
              user: {
                name: 'userResult.name',
                role: 'userResult.role'
              },
              coach: coachResult
            }
          })
    } catch (error) {
        logger.error(error)
        next(error)
    }
})

module.exports = router