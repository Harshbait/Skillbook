const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");


// Get all provider applications
const getProviderApplications = async (req, res) => {
    try {
        const applications = await ProviderProfile.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Approve provider application
const approveProvider = async (req, res) => {
    try {
        const profile = await ProviderProfile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({
                message: "Provider application not found"
            });
        }

        if (profile.status === "approved") {
            return res.status(400).json({
                message: "Provider is already approved"
            });
        }

        profile.status = "approved";
        await profile.save();

        // Change user's role
        await User.findByIdAndUpdate(
            profile.user,
            { role: "provider" }
        );

        res.status(200).json({
            message: "Provider approved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Reject provider application
const rejectProvider = async (req, res) => {
    try {
        const profile = await ProviderProfile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({
                message: "Provider application not found"
            });
        }

        profile.status = "rejected";
        await profile.save();

        res.status(200).json({
            message: "Provider application rejected"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    getProviderApplications,
    approveProvider,
    rejectProvider
};