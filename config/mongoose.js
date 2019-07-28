// mongoose public config

const mongoose = require('mongoose')
const config = require('./index')

module.exports = () => {
  const db = mongoose.connect(config.mongodb, { useNewUrlParser: true })

  require('../models/users.model')
  require('../models/todos.model')
  
  return db
}