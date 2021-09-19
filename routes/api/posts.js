const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

const { addPost } = require('../../controllers/PostController.js');

const addPostValidators = [
    check('text', 'Text is required').notEmpty(),
];

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', [auth, addPostValidators], addPost);

module.exports = router;
