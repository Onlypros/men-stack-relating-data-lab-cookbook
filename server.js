// packages-------------------------------------
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require("path");

// middleware------------------------------------------------
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
// must be placed above all the routes and controllers ^^-------------------------
// These middleware functions should run before any routes that check for a valid user or require a user to be signed in to view a page.

// controller imports---------------------------
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js'); //** 
// importing the controllers ^^---------------------------------------------------

// server config and connection-------------------------------
const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public"))); // joins server path (localhost3000) to the route paths
app.use(morgan('dev')); // logs database responses 
app.use(express.urlencoded({ extended: false })); // handles express forms
app.use(methodOverride('_method')); // uses method override package for full CRUD actions

// initalizes the application on the port
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// initializes the middleware passusertoview
app.use(passUserToView);

// loads the landing page
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use('/auth', authController); // initalizes the auth controller
app.use(isSignedIn); // has to come after /auth because it initializes the issignedin middleware
app.use('/users', usersController); // this initializes the user controller**
app.use('/users/:userId/foods',foodsController); // this initalizes the food controller and has to come below everything beucase it handles the requests with the session user


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});  // has to be last and tells you if everything else is running. if this is broken is when youll see the error messages