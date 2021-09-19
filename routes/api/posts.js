const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const { check } = require('express-validator');

const { addPost, getPosts, getPostById, deletePostById, likePost, unlikePost } = require('../../controllers/PostController.js');

const addPostValidators = [
    check('text', 'Text is required').notEmpty(),
];

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', [auth, addPostValidators], addPost);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, getPosts);

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], getPostById);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], deletePostById);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, checkObjectId('id'), likePost);

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, checkObjectId('id'), unlikePost);

module.exports = router;
