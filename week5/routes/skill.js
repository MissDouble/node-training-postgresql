const express = require('express')
const router = express.Router()
const dataSource = require('../db/data-source')
const logger = require('../utils/logger')('Skill')
const { isUndefined, isNotValidString } = require('../utils/validUtils')
const appError = require('../utils/appError')

router.get('/', async(req, res , next)=> {
try {
    const skill = await dataSource.getRepository('Skill').find({
        select:["id","name"]
    })
    res.status(200).json({
        status: "success",
        data : skill
    })
} catch (error) {
    next(error)
}
})

router.post('/', async(req, res , next)=> {
try {
    const data = req.body
    if(isUndefined(data.name)|| isNotValidString(data.name)){
        // res.status(400).json({
        //     status: "fail",
        //     message: "欄位填寫錯誤"
        // })
        next(appError(400,"欄位未填寫正確"))
        return
    }
    const skillRepo = await dataSource.getRepository('Skill')
    const existSkill = await skillRepo.find({
        where:{
            name:data.name
        }
    })
    if(existSkill.length>0){
        res.status(400).json({
            status: "fail",
            message: "技能重複"
        })
    }
    const newSkill = await skillRepo.create({
        name: data.name
    })
    const result = await skillRepo.save(newSkill)
    res.status(200).json({
        status: "success",
        data: result
    })
} catch (error) {
    logger(error)
    next(error)
}
})

router.delete('/:skillId', async(req, res , next)=> {
try {
    const { skillId } = req.params
    if(isUndefined(skillId)||isNotValidString(skillId)){
        res.status(400).json({
            status: "fail",
            message: "ID錯誤"
        })
        const skillRepo = await dataSource.getRepository('Skill')
        const result = await skillRepo.delete(skillId) 
        if(result.affected === 0){
            res.status(400).json({
            status: "fail",
            message: "找不到指定的技能"
        })
        res.status(200).json({
            status: "success",
        })
}}} catch (error) {
    logger(error)
    next(error);
}
})

module.exports = router;