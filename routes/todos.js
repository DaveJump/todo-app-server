const router = require('koa-router')()
const todosController = require('../controllers/todos.controller')
const response = require('../utils/response')
const utils = require('../utils')

router.prefix('/api')

// 获取todo列表
router.get('/categories/:cid/todos', async (ctx, next) => {
  let { page = 1, page_size, todo_name } = ctx.request.query
  let category = +ctx.params.cid
  
  try {
    let user = await utils.getTokenPayloadProp(ctx)
    let payload = {
      user,
      category,
      todo_name,
      page,
      page_size
    }
    let results = await todosController.getTodoList(payload)
    response.success(ctx, { results })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 获取单个todo信息
router.get('/todo', async (ctx, next) => {
  let todoId = ctx.query.todo_id

  try {
    let user = await utils.getTokenPayloadProp(ctx)
    let payload = {
      user,
      todoId
    }
    let results = await todosController.getTodoById(payload)
    response.success(ctx, { results })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 新增todo
router.post('/categories/:cid/todo', async (ctx, next) => {
  let body = ctx.request.body
  let category = +ctx.params.cid
  let todoName = body.todoName
  let desc = body.desc

  try {
    let user = await utils.getTokenPayloadProp(ctx)
    let payload = {
      user,
      todoName,
      category,
      desc
    }
    await todosController.addTodo(payload)
    response.success(ctx, { message: '新增成功' })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 修改todos
router.put('/todos', async (ctx, next) => {
  let body = ctx.request.body
  let todos = body.todos
  let set = body.set

  if(!todos || !todos.length || !set || !Object.keys(set).length)
  return response.error(ctx, '参数todos，set格式错误', 400)

  try {
    let user = await utils.getTokenPayloadProp(ctx)
    let payload = {
      user,
      todos,
      set
    }
    await todosController.updateTodos(payload)
    response.success(ctx, { message: '修改成功' })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

// 删除todos
router.delete('/todos', async (ctx, next) => {
  let body = ctx.request.body
  let todos = body.todos

  if (!todos || !todos.length) {
    return response.error(ctx, '参数todos格式错误', 400)
  }

  try {
    let user = await utils.getTokenPayloadProp(ctx)
    let payload = {
      user,
      todos
    }
    await todosController.deleteTodos(payload)
    response.success(ctx, { message: '删除成功' })
  } catch (e) {
    response.error(ctx, e.message)
  }
})

module.exports = router