const mongoose = require('mongoose');

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
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
