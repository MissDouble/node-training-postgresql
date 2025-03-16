const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('admin')
const { isUndefined, isNotValidString, isValidPassword } = require('../utils/validUtils')
const isAuth = require('../middleware/isAuth')
const isCoach = require('../middleware/isCoach')


router.post('/coaches/courses', isAuth, isCoach, async (req, res, next) => {//這個放在userId的路由上面，是因為，才不會一直被當作userId
    try {
      // TODO 可以做檢查日期格式
      // 可以用 moment
      //此API少檢查了skill_id的部分 文件沒有寫
      const { user_id, skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body
      if(!isValidString(user_id) || !isValidString(skill_id) || !isValidString(name)
      || !isValidString(description) || !isValidString(start_at) || !isValidString(end_at)
      || !isNumber(max_participants) || !isValidString(meeting_url) || !meeting_url.startsWith('https')) {
        res.status(400).json({
          status : "failed",
          message: "欄位未填寫正確"
        })
        return
      }
      const userRepo = dataSource.getRepository.get(User)
      const findUser = await userRepo.findOne({//如果是用.find 後面要加上.length>0 的檢查 兩種寫法都可以
        where:{
            id:user_id
        }
      })
      if(!findUser){
        res.status(400).json({
        status : "failed",
        message: "使用者不存在"
        })
        return
      }else if(findUser.role !== 'COACH'){
        res.status(400).json({
        status : "failed",
        message: "使用者尚未成為教練"
        })
        return
    }
      const courseRepo = dataSource.getRepository('Course')
      const newCourse = courseRepo.create({
        user_id,
        skill_id,
        name,
        description,
        start_at,
        end_at,
        max_participants, 
        meeting_url 
      })
      const result = await courseRepo.save(newCourse)

    // const existCourse = courseRepo.find({
    // where:{
    //     id:user_id
    // })
      res.status(201).json({
        status: "success",
        data: result
        })
    } catch (error) {
      logger.error(error)
      next(error)
    }
  })

router.put('/coaches/courses/:courseId', isAuth, isCoach, async (req, res, next) => {
  try {
    const { courseId } = req.params
    // TODO 可以做檢查日期格式
    // 可以用 moment
    const { skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body
    if( !isValidString(courseId)
    ||  !isValidString(skill_id) || !isValidString(name)
    || !isValidString(description) || !isValidString(start_at) || !isValidString(end_at)
    || !isNumber(max_participants) || !isValidString(meeting_url) || !meeting_url.startsWith('https')) {
      res.status(400).json({
        status : "failed",
        message: "欄位未填寫正確"
      })
      return
    }
    const courseRepo = dataSource.getRepository('Course')
    const findCourse = await courseRepo.findOne({
        where:{
            id:courseId
        }
    })
    if(!findCourse){
        res.status(400).json({
            status: 'failed',
            message: "課程不存在"
        })
        return
    }
const updateCourse = await courseRepo.update({
id:courseId
},{
skill_id,
name,
description,
start_at,
end_at,
meeting_url,
max_participants
})
if(updateCourse.affected === 0){
    res.status(400).json({
        status:"failed",
        message:"更新課程失敗"
    })
    return
}
const courseResult = await courseRepo.findOne({
    where:{
        id: courseId
    }
})
    res.status(201).json({
      status: "success",
      data: {
        course: courseResult
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})
 
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