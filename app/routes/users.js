const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

// Login form GET
router.get('/login', UserController.user_login_form);

// Login POST
router.post('/login', UserController.user_login);

// Logout User
router.get('/logout', UserController.user_logout);

// Register form GET
router.get('/register', UserController.user_register_form);

// Register POST
router.post('/register', UserController.user_register);

module.exports = router;