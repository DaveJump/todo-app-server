const router = require('koa-router')()
const usersController = require('../controllers/users.controller')
const response = require('../utils/response')
const utils = require('../utils')

router.prefix('/api')

// 用户注册
router.post('/auth', async (ctx, next) => {
  let body = ctx.request.body
  let username = body.username
  let password = body.password

  try {
    let payload = {
      username,
      password
    }
    await usersController.register(payload)
    response.success(ctx, { message: '注册成功' })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 用户登录
router.put('/auth', async (ctx, next) => {
  let body = ctx.request.body
  let username = body.username
  let password = body.password

  try {
    let payload = {
      username,
      password
    }
    let results = await usersController.login(payload)
    if (results) {
      let { token, expiresIn } = results
      let cookieOptions = {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: false
      }
      ctx.cookies.set('todoAppUserToken', token, cookieOptions)
      response.success(ctx, { message: '登录成功', results })
    } else {
      response.error(ctx, 'token生成错误')
    }
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 修改用户密码
router.put('/user/password', async (ctx, next) => {
  let body = ctx.request.body
  let oldPassword = body.oldPassword
  let newPassword = body.newPassword
  let user = await utils.getTokenPayloadProp(ctx)

  try {
    let payload = {
      user,
      oldPassword,
      newPassword
    }
    await usersController.changePassword(payload)
    response.success(ctx, { message: '修改密码成功' })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

module.exports = router