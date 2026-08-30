const ProviderProfile = require("../models/ProviderProfile");

const applyAsProvider = async (req, res) => {
    try {
        const {
            bio,
            skills,
            experience
        } = req.body;

        const existingProfile = await ProviderProfile.findOne({
            user: req.user.userId
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Provider application already exists"
            });
        }

        const profile = await ProviderProfile.create({
            user: req.user.userId,
            bio,
            skills,
            experience
        });

        res.status(201).json({
            message: "Provider application submitted successfully",
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    applyAsProvider
};