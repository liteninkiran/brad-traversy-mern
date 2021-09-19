const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerUser } = require('../../controllers/UserController.js');

const validators = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 characters or more').isLength({ min: 6 }),
];

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', validators, registerUser);

module.exports = router;
