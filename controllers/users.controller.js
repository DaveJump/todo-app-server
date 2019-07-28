// users controller
const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const vars = require('../utils/vars')

/**
 * 用户注册
 * @param {Object} payload 
 * payload.username 用户名
 * payload.password 密码
 */
const register = payload => {
  let { username, password } = payload

  return new Promise((resolve, reject) => {
    // 先检查用户是否被注册
    Users.findOne({username}, async (err, doc) => {
      if (!err) {
        if (doc) {
          reject(new Error('用户已被注册'))
        } else {
          try {
            let decryptedPwd = utils.privateDecrypt(password)
            let pwdMD5 = utils.hashMD5(decryptedPwd)
            
            await Users.create({
              username,
              password: pwdMD5
            })
            resolve()
          } catch (e) {
            reject(e)
          }
        }
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 用户登录
 * @param {Object} payload
 * payload.username 用户名
 * payload.password 密码
 */
const login = payload => {
  let { username, password } = payload

  return new Promise((resolve, reject) => {
    // 先检查用户是否存在
    Users.findOne({username}, (err, doc) => {
      if (!err) {
        if (!doc) {
          reject(new Error('用户不存在'))
        } else {
          try {
            let decryptedPwd = utils.privateDecrypt(password)
            let pwdMD5 = utils.hashMD5(decryptedPwd)
            let pwd = doc.password
            let uid = doc._id
            let _USER = doc.username
  
            if(pwdMD5 !== pwd){
              reject(new Error('用户名或密码不正确'))
            } else {
              // 生成token(默认一天后过期)
              let expiresIn = 24 * 60 * 60
              jwt.sign({ uid }, vars.tokenSecret, { expiresIn }, function (err, token) {
                !err && resolve({ username: _USER, token, expiresIn: expiresIn * 1000 })
              })
            }
          } catch (e) {
            reject(e)
          }
        }
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 更改用户密码
 * @param {Object} payload 
 * payload.user 用户
 * payload.oldPassword 旧密码
 * payload.newPassword 新密码
 */
const changePassword = payload => {
  let { user, oldPassword, newPassword } = payload

  return new Promise((resolve, reject) => {
    Users.findOne({_id: user}, (err, doc) => {
      if (!err) {
        if (!doc) {
          reject(new Error('用户不存在'))
        } else {
          try {
            let uid = doc._id
            let upwd = doc.password
            let decryptedOldPwd = utils.privateDecrypt(oldPassword)
            let oldPwdMD5 = utils.hashMD5(decryptedOldPwd)
            let decryptedNewPwd = utils.privateDecrypt(newPassword)
            let newPwdMD5 = utils.hashMD5(decryptedNewPwd)
  
            if (oldPwdMD5 !== upwd) {
              reject(new Error('旧密码不正确'))
            } else {
              Users.updateOne(
                { _id: uid },
                { $set: { password: newPwdMD5 } },
                (err, doc) => {
                  !err ? resolve() : reject(err)
                }
              )
            }
          } catch (e) {
            reject(e)
          }
        }
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  register,
  login,
  changePassword
}
