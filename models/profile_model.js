const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    isCreated: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true
    },
    username:{
        type: String,
        trim: true,
        unique: true
    },
    bio: {
        type: String,
        required: true,
        default: "new user"
    },
    image : {
        type: String,
    },
    followCount: {
        type: Number,
    },
    followingCount: {
        type: Number
    }
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile ;