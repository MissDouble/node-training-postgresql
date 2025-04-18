const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const { verifyJWT } = require('../utils/jwtUtils')
const logger = require('../utils/logger')('isAuth')

const isAuth = async (req, res, next) => {
  try {
    // Authorization: Bearer xxxxxxx.yyyyyyy.zzzzzzz
    // 確認 token 是否存在並取出 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      // 401: 你尚未登入！
      next(appError(401,'你尚未登入！'))
      return 
    }
//token = xxxxxxx.yyyyyyy.zzzzzzz
    const token = authHeader.split(' ')[1]

    // 驗證 token
    const decoded = await verifyJWT(token)
    // {
    //     id:findUser.id,
    //     role:findUser.role
    // }

    // 在資料庫尋找對應 id 的使用者
    // 401: '無效的 token'
    const currentUser = await dataSource.getRepository('User').findOne({
        where:{
            id:decoded.id
        }
    })
    if(!currentUser){
        next(appError(401,'無效的token'))
        return
    }

    // 在 req 物件加入 user 欄位
    req.user = currentUser//這個req.user參數可以傳到下一個middleware去使用

    next();
  } catch (error) {
    logger.error(error.message)
    next(error)
  }
};

module.exports = isAuth