const mongoose = require('mongoose')
const Schema = mongoose.Schema

// users model
const userSchema = new Schema({
  uid: Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  registerTime: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Users', userSchema)