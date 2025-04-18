const jwt = require('jsonwebtoken')
const config = require('../config/index')
const appError = require('./appError')

const generateJWT = (payload)=> {
  // 產生 JWT token
  return jwt.sign(
      payload, 
      config.get('secret.jwtSecret'),
      {expiresIn: config.get('secret.jwtExpiresday')}
  );
}

const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.get('secret.jwtSecret'), (err, decoded) => {
        if (err) {
          //reject(err)
          switch(err.name){
            case 'TokenExpireError':
                reject(appError(401, 'Token已過期'))
                break
                default:
                    reject(appError(401, '無效的token'))
                    break
          }
        } else {
          resolve(decoded)
        }
      })
    })
  }

module.exports = { 
  generateJWT,
  verifyJWT
};
