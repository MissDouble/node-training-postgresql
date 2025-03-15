const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')
const { isUndefined, isNotValidString, isValidPassword } = require('../utils/validUtils')

router.post('/', async(req,res,next)=>{
    try {
        const data = req.body
        if(isUndefined(data.name)||isNotValidString(data.name)||
            isUndefined(data.email)||isNotValidString(data.email)||
            isUndefined(data.password)||isValidString(data.password)){
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確"
            })
            return
        }
        if(isValidPassword(data.password)){
            res.status(400).json({
                status: "failed",
                message: "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
            })
            return
        }
        const userRepo = await dataSource.getRepository('User')
        const findUser = await userRepo.findOne({//只有查找一筆資料用findOne
            where:{//這邊where也可以下select，
                email
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
            password:data.hashPassword,
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
       next(error) ;
    }


})

module.exports = router