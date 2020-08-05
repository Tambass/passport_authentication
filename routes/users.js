const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Tous les champs doivent être remplis !" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Les mots de passe sont différents !" });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({
      msg: "Le mot de passe doit avoir au minimum 6 caractères !",
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Cet email a déjà été enregistré !" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed
            newUser.password = hash;

            // Save user
            newUser
              .save()
              .then((user) => {
                res.redirect("/login");
              })
              .catch(err, console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;

// reprendre la video à 51:32 https://www.youtube.com/watch?v=6FOq4cUdH8k&list=PLillGF-RfqbZ2ybcoD2OaabW2P7Ws8CWu&index=3&t=0s
