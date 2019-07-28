// todos controller

const mongoose = require('mongoose')
const Todos = mongoose.model('Todos')

/**
 * 新增todo
 * @param {Object} payload
 * payload.user 用户名
 * payload.todoName todo名称
 * payload.category todo分类
 * payload.desc todo描述
 */
const addTodo = payload => {
  let { user, todoName, category = 0, desc = '' } = payload

  return new Promise(async (resolve, reject) => {
    try {
      await Todos.create({
        user,
        todoName,
        todoStatus: 0, // 默认添加后是未完成状态
        category,
        desc
      })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 获取todos
 * @param {Object} payload
 * payload.user 用户名
 * payload.category todo分类
 * payload.todo_name todo名称，搜素时用到
 * payload.page 当前页
 * payload.page_size 页大小
 */
const getTodoList = payload => {
  let { user, category, todo_name, page, page_size } = payload
  let queryCondition = Object.assign(
    { user, category },
    todo_name ? { todoName: { $regex: todo_name, $options: 'i' } } : {}
  )

  return new Promise(async (resolve, reject) => {
    Todos.countDocuments(queryCondition, (err, count) => {
      if (!err) {
        let condition
        if (+page >= 1 && !isNaN(page_size)) {
          condition = {
            ...condition,
            skip: (page - 1) * page_size,
            limit: +page_size
          }
        } else {
          condition = {
            ...condition,
            skip: 0,
            limit: 0
          }
        }
        let query = Todos.find(queryCondition, null, condition).sort({ '_id': -1 })
        query.exec((err, list) => {
          if (!err && list) {
            resolve({
              list,
              total: count
            })
          } else {
            reject(err)
          }
        })
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 获取单个todo信息
 * @param {*} payload 
 */
const getTodoById = payload => {
  const { todoId } = payload

  return new Promise((resolve, reject) => {
    Todos.findById(todoId, (err, doc) => {
      !err ? resolve(doc) : reject(err)
    })
  })
}

/**
 * 批量修改todos
 * @param {Object} payload
 * payload.user 用户名
 * payload.todos 需要修改的todo_id数组
 * payload.set 需要修改的字段对象，与model对应
 */
const updateTodos = payload => {
  const { user, todos, set } = payload

  return new Promise((resolve, reject) => {
    Todos.updateMany(
      { user, _id: { $in: todos } },
      { $set: set },
      (err, doc) => {
        !err ? resolve() : reject(err)
      }
    )
  })
}

/**
 * 批量删除todos
 * @param {Object} payload
 * payload.user 用户名
 * payload.todos 需要删除的todo_id数组
 */
const deleteTodos = payload => {
  const { user, todos } = payload

  return new Promise((resolve, reject) => {
    Todos.deleteMany(
      { user, _id: { $in: todos } },
      (err, doc) => {
        !err ? resolve() : reject(err)
      }
    )
  })
}

module.exports = {
  addTodo,
  getTodoList,
  getTodoById,
  updateTodos,
  deleteTodos
}