const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const vars = require('../utils/vars')

const addShortSalt = str => `p:${str}&s:YuY`

module.exports = {
  hashMD5: str => {
    let md5hash = crypto.createHash('md5')
    let afterSalt = addShortSalt(str)
    
    return md5hash.update(afterSalt).digest('hex')
  },
  privateDecrypt: str => {
    let privateKey = fs.readFileSync(path.resolve('/www/todo-app/pk.pem'))
    console.log(privateKey, 'privateKey')
    let textBuffer = Buffer.from(str, 'base64')
    let decryptedText = crypto.privateDecrypt({
      key: privateKey,
      // 因为前端加密库使用的RSA_PKCS1_PADDING标准填充,所以这里也要使用RSA_PKCS1_PADDING
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, textBuffer).toString()
    
    return decryptedText
  },
  getTokenPayloadProp: (ctx, prop = 'uid') => {
    let token = ctx.request.header.authorization.split(' ')[1]

    return new Promise((resolve, reject) => {
      jwt.verify(token, vars.tokenSecret, (err, decoded) => {
        if (err) {
          reject(new Error(vars.unathorizeText))
        } else {
          decoded[prop] ? resolve(decoded[prop]) : reject(new Error('验证token失败'))
        }
      })
    })
  }
}