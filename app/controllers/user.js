const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

exports.user_login_form = (req, res) => {
    res.render('users/login');
}

exports.user_login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

exports.user_logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}

exports.user_register_form = (req, res) => {
    res.render('users/register');
}

exports.user_register = (req, res) => {
    let errors = [];

    if(req.body.password !== req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }

    if(req.body.password.length < 8) {
        errors.push({text: 'Password must be at least 8 characters'});
    }

    if(errors.length) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({email: req.body.email})
          .then(user => {
              if(user) {
                  req.flash('error_msg', 'Email already registered');
                  res.redirect('/users/login');
              } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                          .then(user => {
                              req.flash('success_msg', 'You are now registered and can log in');
                              res.redirect('/users/login');
                          })
                          .catch(err => {
                              console.log(err);
                              return;
                          });
                    });
                });
              }
          });
    }
}