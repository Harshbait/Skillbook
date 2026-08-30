const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 500
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        experience: {
            type: Number,
            min: 0
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ProviderProfile",
    providerProfileSchema
);