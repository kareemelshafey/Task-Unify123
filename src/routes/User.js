const User = require('../models/User');
const jwt = require('jsonwebtoken');
const express = require("express");
const expressValidator = require("express-validator");
const router = express.Router();

router.post(
    '/signup',
    [
        expressValidator.body('email')
        .isEmail()
        .withMessage('Email must be valid'),
        expressValidator.body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
    ],
    async (req, res) => {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.send('Email in use');
      }
      const newUser = new User(req.body)
      newUser.save(function(err, user) {
        if (err) {
        return res.status(400).send({
            message: err
        });
        } else {
        user.password = undefined;
        return res.json(user);
        }
        })
    }
  );

  router.post(
    '/signIn',
    [
        expressValidator.body('email')
        .isEmail()
        .withMessage('Email must be valid'),
        expressValidator.body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
    ],
    async (req, res) => {
        User.findOne({
            email: req.body.email
          }, function(err, user) {
            if (err) throw err;
            console.log(req.body.password)
            console.log(user.password)
            if (!user || (req.body.password != user.password)) {
              return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
            }
            return res.json({ token: jwt.sign({ email: user.email, fullName: user.name, _id: user._id }, 'KareemElshafey') });
          });
    }
  );


  module.exports = router;
