module.exports = {
  error: (ctx, msg = 'error', code = 500) => {
    return ctx.throw(code, msg, { status: 'error', message: msg })
    // ctx.statusCode = code
    // return ctx.body = {
    //   status: 'error',
    //   message: msg
    // }
  },
  success: (ctx, { status = 'success', message = '成功', results = {} }) => {
    return ctx.body = {
      status,
      message,
      results
    }
  }
}