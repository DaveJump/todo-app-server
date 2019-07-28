const mongoose = require('mongoose')
const Schema = mongoose.Schema

// todos model
const todoSchema = new Schema({
  todoId: Schema.Types.ObjectId,
  user: {
    type: String,
    required: true
  },
  todoName: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  todoStatus: {
    type: Number,
    required: true
  },
  category: Number,
  createTime: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Todos', todoSchema)