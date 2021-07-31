const mongoose = require('mongoose');

const fitSchema = {
  title: String,
  content: String,
};

const Fit = mongoose.model('Fit', fitSchema);

module.exports = Fit;
