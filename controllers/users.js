// packages
const express = require('express');
const router = express.Router();
// model
const User = require('../models/user.js');

// Route to display the community page
router.get('/community', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    
    // Render the community page and pass the users to the view
    res.render('users/community.ejs', { users });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// Route to display a specific user's pantry
router.get('/:userId/pantry', async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.params.userId);
    
    // Check if the user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Render the pantry page, passing the user and their pantry
    res.render('users/pantry.ejs', { user });
  } catch (err) {
    console.log(err);
    res.redirect('/users/community');
  }
});

  module.exports = router;