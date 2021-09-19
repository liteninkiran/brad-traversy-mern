const { validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');

exports.getProfile = async (req, res) => {
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

exports.createOrUpdateProfile = async (req, res) => {

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

exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}

exports.deleteProfileByUserId = async (req, res) => {
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
        return res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
}

exports.addExperience = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };

    try {
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const profile = await Profile.findOne({ user: req.user.id });

        // Unshift is like push, but is pushes on to the beginning of the array
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}

exports.deleteExperience = async (req, res) => {

    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });

        if (!foundProfile) return res.status(400).json({ msg: 'Profile not found' });

        foundProfile.experience = foundProfile.experience.filter((exp) => {
            exp._id.toString() !== req.params.exp_id
        });

        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }

}
