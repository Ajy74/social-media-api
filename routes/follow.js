const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profile_model");

const followRouter = express.Router();


//& update follow & following api
followRouter.get("/api/follow", auth, async (req, res)=>{
    const { friendId } = req.query;

    try {
        
        let newFollow = await Profile.findOne({ "userId": req.userid });

        if(!newFollow){
            return res.status(400).json({ 
                status: 400,
                msg: "user deleted their account just a minute ago !"
            });
        }
        
        //^ updates current user
        const followingSchema = {
            userId: friendId
        };
        newFollow.followingCount = newFollow.followingCount+1;
        newFollow.following.push( followingSchema );
        newFollow = await newFollow.save();
        
        //^ updates in friend user
        let friendUser = await Profile.findOne({ "userId": friendId });
        const followerSchema = {
            userId: req.userid
        };
        friendUser.followerCount = friendUser.followerCount+1;
        friendUser.follower.push(followerSchema);
        friendUser = await friendUser.save();

        //^ now send response to current user
        res.status(200).json({
            profile: newFollow
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//& remove follow api
followRouter.get("/api/unfollow", auth, async (req, res)=>{
    const { friendId } = req.query;

    try {
        
        let removeFriend = await Profile.findOne({ "userId": req.userid });
        
        removeFriend.followingCount = removeFriend.followingCount-1;
        removeFriend.following.pull( { userId: friendId } );
        removeFriend = await removeFriend.save();
        
        //^ updates in friend user
        let friendUser = await Profile.findOne({ "userId": friendId });

        if(!friendUser){
            return res.status(200).json({
                profile: removeFriend
            });
        }

        friendUser.followerCount = friendUser.followerCount-1;
        friendUser.follower.pull( { userId: req.userid } );
        friendUser = await friendUser.save();

        //^ now send response to current user
        res.status(200).json({
            profile: removeFriend
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = followRouter ;