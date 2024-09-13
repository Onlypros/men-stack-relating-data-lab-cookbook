const mongoose = require('mongoose');

// user.js

const foodSchema = new mongoose.Schema({
  // YOU DO: Define properties of food schema
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  category: {
    type: String,
    enum: ['Fruit', 'Vegetable', 'Meat', 'Dairy', 'Snack', 'Grain', 'Pasta', 'Herbs & Spices', 'Canned Goods', 'Cooking Essentials', 'Baking', 'Other'],
    required: true
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry:[foodSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
