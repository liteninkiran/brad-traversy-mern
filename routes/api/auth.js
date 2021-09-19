const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const { getUser, authenticateUser } = require('../../controllers/AuthController.js');

const User = require('../../models/User');

const validators = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists(),
];


// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, getUser);

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', validators, authenticateUser);

module.exports = router;
