const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

const validators = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 characters or more').isLength({ min: 6 }),
];

// @route   POST api/users
// @desc    Register user
// @access  Public
const registerUser = async (req, res) => {

    // Validate inputs
    const errors = validationResult(req);

    // Return if validation fails
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const { name, email, password } = req.body;

    try {

        // Try and find user
        let user = await User.findOne({ email });

        // Return if user already exists
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Gravatar options
        const gravatarOptions = {
            s: '200',
            r: 'pg',
            d: 'mm',
        };

        // Get user's gravatar
        // const avatar = normalize(gravatar.url(email, gravatarOptions), { forceHttps: true });
        const avatar = gravatar.url(email, gravatarOptions);

        // Create new user
        user = new User({
            name,
            email,
            avatar,
            password,
        });
    
        // Create salt
        const salt = await bcrypt.genSalt(10);

        // Encrypt password
        user.password = await bcrypt.hash(password, salt);
  
        // Save to database
        await user.save();

        // Configure JWT parameters
        const payload = { user: { id: user.id } };
        const jwtOptions = { expiresIn: '5 days' };
        const secret = config.get('jwtSecret');
    
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

router.post('/', validators, registerUser);

module.exports = router;

