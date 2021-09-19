const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
// const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

router.get('/me', auth, getProfile);

const validators = [
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
];

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request
    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
    } = req.body;

    // Create profile object (the user id is embedded in the auth token)
    const profileFields = {
        user: req.user.id,
        website: website && website !== '' ? website : '',
        skills: Array.isArray(skills) ? skills : skills.split(',').map((skill) => ' ' + skill.trim()),
        ...rest
    };

    // Create "social fields" object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // Normalise social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
            socialFields[key] = value;
    }

    // Add scoial fields to profile object
    profileFields.social = socialFields;

    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }

}

router.post('/', auth, validators, createOrUpdateProfile);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

router.get('/', getAllProfiles);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

const getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}

router.get('/user/:user_id', checkObjectId('user_id'), getProfileByUserId);

// @route    DELETE api/profile/user/:user_id
// @desc     Delete profile, user & posts
// @access   Private

const deleteProfileByUserId = async (req, res) => {
    const user = await User.findOne({ _id: req.params.user_id });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    try {
        // Remove user posts
        // Remove profile
        // Remove user
        await Promise.all([
            Post.deleteMany({ user: req.user.id }),
            Profile.findOneAndRemove({ user: req.user.id }),
            user.delete(),
        ]);
        return res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}

router.delete('/user/:user_id', auth, checkObjectId('user_id'), deleteProfileByUserId);

module.exports = router;
