const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

router.get('/', auth, getUser);

const validators = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists(),
];

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
const authenticateUser = async (req, res) => {

    // Validate inputs
    const errors = validationResult(req);

    // Return if validation fails
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const { email, password } = req.body;

    try {

        // Try and find user
        let user = await User.findOne({ email });

        // Return if user doesn't exist
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Configure JWT parameters
        const payload = { user: { id: user.id } };
        const jwtOptions = { expiresIn: '5 days' };
        const secret = config.get('jwtSecret');

        // Check password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        // Return if passwords do not match
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Return JSON web token
        jwt.sign(payload, secret, jwtOptions, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

router.post('/', validators, authenticateUser);

module.exports = router;
