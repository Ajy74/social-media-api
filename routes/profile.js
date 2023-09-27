const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profile_model");

const profileRouter = express.Router();

//& create user profile
profileRouter.post("/api/create-profile", auth, async  (req, res) =>{

    const {username, bio, image}  = req.body;

    //^ check username exist or not
    const isUserNameExist = await Profile.findOne({ username });

    if(isUserNameExist){
        return res.status(400).json({ 
            status: 400,
            msg: "username already exist !"
        });
    }

    try {
        //^ create profile modeltype
        let newProfile = new Profile({
            isCreated: true,
            userId: req.userid,
            username,
            bio,
            image,
        });

        //^ save new profile to databse
        newProfile = await  newProfile.save();

        res.status(200).json({ 
            profile: newProfile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//& update user profile
profileRouter.post("/api/update-profile", auth, async  (req, res) =>{

    const {username, bio, image}  = req.body;

    //^ check username exist or not
    let profileExist = await Profile.findOne({ "userId": req.userid });

    if(!profileExist){
        return res.status(400).json({ 
            status: 400,
            msg: "profile not found !"
        });
    }

    try {
        //^ Update the profile fields
        if(profileExist.username != username){
            const isUserNameExist = await Profile.findOne({ username });

            if(isUserNameExist){
                return res.status(400).json({ 
                    status: 400,
                    msg: "username already exist !"
                });
            }
            profileExist.username = username;
        }
        profileExist.bio = bio;
        profileExist.image = image;

        //^ save new profile to databse
        profileExist = await  profileExist.save();

        res.status(200).json({ 
            profile: profileExist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//& get user profile
profileRouter.get("/api/profile", auth, async  (req, res) =>{
    try {

        let profileExist = await Profile.findOne({ "userId": req.userid });

        if(!profileExist){
            return res.status(400).json({ 
                status: 400,
                msg: "Profile not found !"
            });
        }
        
        res.status(200).json({ 
            profile: profileExist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = profileRouter ;