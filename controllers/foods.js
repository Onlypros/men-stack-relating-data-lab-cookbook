// controllers/foods.js
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab
router.get('/', (req, res) => {
    res.render('foods/index.ejs')
  });
  

router.get('/new', (req, res) => {
    res.render('new.ejs')
  });

router.post('/', async (req, res ) => {
  const currentUser = await User.findById(req.session.user._id)
  try {
    currentUser.pantry.push(req.body)
    await currentUser.save()
    return res.redirect('/')
  } catch(error) {
    console.log(error)
    res.redirect(`/users/${currentUser._id}/foods/new`)
  }
});  









module.exports = router;


