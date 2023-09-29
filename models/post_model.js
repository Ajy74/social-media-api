const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type:{
        required: true,
        type: String, //^ vedio or image or sponser
    },
    url: [
        {
            type: String
        }
    ],
    date:{
        type: Date,
        default: Date.now // Automatically set to the current date and time 
    },
    desc: {
        type: String,
        required: true,
    },
    tags : {
        type: String,
    },
    likeCount:{
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },
    savedCount: {
        type: Number,
        default: 0
    },
    screenImpressionCount: {
        type: Number,
        default: 0
    },
    sponsersClickedCount: {
        type: Number,
        default: 0
    },
    likedBy: [
        {
            userId:{
                type: String
            }
        }
    ],
    comments: [
        {
            userId:{
                type: String
            },
            comment: {
                type: String
            }
        }
    ]
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;