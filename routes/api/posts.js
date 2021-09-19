const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const { check } = require('express-validator');

const { addPost, getPosts, getPostById, deletePostById, likePost, unlikePost, addComment, deleteComment } = require('../../controllers/PostController.js');

const addPostValidators = [
    check('text', 'Text is required').notEmpty(),
];

const addCommentValidators = [
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

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post('/comment/:id', [auth, checkObjectId('id'), addCommentValidators], addComment);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, deleteComment);

module.exports = router;
