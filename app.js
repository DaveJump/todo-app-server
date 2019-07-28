const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const response = require('./utils/response')
const koajwt = require('koa-jwt')
const vars = require('./utils/vars')

// mongoose
require('./config/mongoose')()

// router
const users = require('./routes/users')
const todos = require('./routes/todos')

// error handler
onerror(app)

// response context handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      response.error(ctx, vars.unathorizeText, 401)
    } else {
      throw err
    }
  }
})

// token verifying
app.use(koajwt({ secret: vars.tokenSecret }).unless({ path: [/^\/api\/auth\/?.*/] }))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(users.routes(), users.allowedMethods())
app.use(todos.routes(), todos.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
})

module.exports = app
