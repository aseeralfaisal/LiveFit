const mongoose = require('mongoose');

const dpSchema = mongoose.Schema({
  dp: {
    type: String,
    required: true,
  },
});
const DP = mongoose.model('dp', dpSchema);

module.exports = DP;
