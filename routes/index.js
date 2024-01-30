// Require necessary modules
var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Configure Passport.js
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Route to render user registration form
router.get("/userregister", function (req, res, next) {
  res.render("userregister", { title: "Express" });
});

// Route to handle user registration form submission
router.post("/userregister", async function (req, res) {
  try {
    // Check if the username already exists in the database
    const existingUser = await userModel.findOne({ username: req.body.username });
    if (existingUser) {
      return res.send("Username already exists");
    }
    
    // Create a new user model instance with username and password from request body
    const newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
    });
    
    // Save the new user to the database
    await newUser.save();
    
    // Redirect to homepage after successful registration
    res.redirect('/homepage');
  } catch (err) {
    console.error(err);
    return res.send("Error registering user");
  }
});

// Route to handle user login form submission
router.post("/login", passport.authenticate("local", {
  successRedirect: "/homepage",
  failureRedirect: "/userregister",
}));

// Route to render user profile
router.get("/profile", isloggedin, function (req, res, next) {
  res.render("profile", { title: "Express" });
});

// Route to render homepage
router.get("/homepage", isloggedin, function (req, res, next) {
  res.render("homepage", { title: "Express" });
});

// Middleware to check if user is logged in
function isloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/error");
  }
}

// Export router
module.exports = router;
