const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
  },
  dailyGoal: {
    type: String,
    required: false,
  },
  height: {
    type: String,
    required: false,
  },
  bodyweight: {
    type: String,
    required: false,
  },
  bodyfat: {
    type: String,
    required: false,
  },
  dpLink: {
    type: String,
    required: false,
  },
})
const User = mongoose.model('User', UserSchema)

module.exports = User
