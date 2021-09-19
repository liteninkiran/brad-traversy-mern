const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');
const { getProfile, createOrUpdateProfile, getAllProfiles, getProfileByUserId, deleteProfileByUserId, addExperience, deleteExperience, addEducation, deleteEducation } = require('../../controllers/ProfileController.js');

const validators = [
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
];

const experienceValidators = [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From is required').notEmpty(),
    check('to', 'To date must be after from date').custom((value, { req }) => (req.body.from ? value > req.body.from : true)),
];

const educationValidators = [
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
];


// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, getProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth, validators], createOrUpdateProfile);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', getAllProfiles);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', checkObjectId('user_id'), getProfileByUserId);

// @route    DELETE api/profile/user/:user_id
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/user/:user_id', [auth, checkObjectId('user_id')], deleteProfileByUserId);

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put('/experience', [auth, experienceValidators], addExperience);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete profile experience
// @access   Private
router.delete('/experience/:exp_id', [auth, checkObjectId('exp_id')], deleteExperience);

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put('/education', [auth, educationValidators], addEducation);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete profile education
// @access   Private
router.delete('/education/:edu_id', [auth, checkObjectId('edu_id')], deleteEducation);

module.exports = router;
