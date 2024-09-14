// packages
const express = require('express');
const router = express.Router();
// model
const User = require('../models/user.js');

// Index route to show all foods for the current user
router.get('/', async (req, res) => {
  try {
    // Find the current user by their session ID
    const currentUser = await User.findById(req.session.user._id);
    // If the user is not found, redirect home
    if (!currentUser) {
      return res.redirect('/');
    }
    // Pass the user's foods to the template
    res.render('foods/index.ejs', {
      foods: currentUser.pantry, // Assuming "pantry" holds the food items - Passing pantry as foods
      user: currentUser          // Passing user for linking
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// New food form route
router.get('/new', (req, res) => {
    res.render('foods/new.ejs')
  });
// Create route to handle form submission and add food item
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    // Log the request body to confirm data is being received
    console.log('Request body:', req.body);  // <--- Add this line here
    // Create a new food object from req.body
    const newFood = {
      name: req.body.name,
      quantity: req.body.quantity,
      category: req.body.category,
    };
    // Add the new food to the user's pantry array
    currentUser.pantry.push(newFood);
    // Save the user document with the new food item
    await currentUser.save();
    // Redirect to the foods index page after adding a new food item
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${currentUser._id}/foods/new`);
  }
});

// DELETE route to remove a food item from the pantry
router.delete('/:foodId', async (req, res) => {
  try {
    // Find the current user by their session ID
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    // Find the index of the food item in the pantry array
    const foodIndex = currentUser.pantry.findIndex(food => food._id == req.params.foodId);
    // If the food is not found, return an error
    if (foodIndex === -1) {
      return res.status(404).send('Food item not found');
    }
    // Remove the food item from the pantry array
    currentUser.pantry.splice(foodIndex, 1);
    // Save the updated user document
    await currentUser.save();
    // Redirect to the foods index page after deletion
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${currentUser._id}/foods`);
  }
});

// renders the food edit form
router.get('/:foodId/edit' , async function(req, res) {
  try {
    //find the user
    const currentUser = await User.findById(req.session.user._id)
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    //find the current food item
    const food = currentUser.pantry.find(food => food._id == req.params.foodId);
    if (!food) {
      return res.status(404).send('Food item not found');
    }
    // render the edit page
    res.render('foods/edit.ejs', {
      food: food,
      user: currentUser
    });
  } catch (err) {
  console.log(err)
  res.redirect('/')
  }
});

// PUT route to handle the food update
router.put('/:foodId', async (req, res) => {
  try {
    console.log('Request body:', req.body); // this will confirm that the form data is reaching the server when the edit form is submitted
    // Find the current user by their session ID
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    // Find the food item by its ID
    const food = currentUser.pantry.find(food => food._id == req.params.foodId);
    if (!food) {
      return res.status(404).send('Food item not found');
    }
    // Update the food item's properties with the new values from req.body
    food.name = req.body.name;
    food.quantity = req.body.quantity;
    food.category = req.body.category;
    // Save the updated user document
    await currentUser.save();
    // Redirect to the foods index page after updating the food item
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${currentUser._id}/foods`);
  }
});

// always need this to export everything happening here
module.exports = router;