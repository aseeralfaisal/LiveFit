const mongoose = require('mongoose')

const MealsSchema = mongoose.Schema({
  mealName: {
    type: String,
    required: true,
  },
  foodItems: {
    type: Array,
    required: true,
  },
  totalCals: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
})
const Meals = mongoose.model('Meals', MealsSchema)

module.exports = Meals
