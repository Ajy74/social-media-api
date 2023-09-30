const express = require("express");
const multer = require("multer");

const auth = require("../middleware/auth");
const Profile = require("../models/profile_model");
const User = require("../models/user_model");

const profileRouter = express.Router();

//& middleware for image upload using multer
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback){
            callback(null, "uploads/profiles/")
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + `${file.originalname}`)
        }
    })
}).single("image");

//& update profile image
profileRouter.post("/api/profile-image", auth, upload, async(req, res) =>{

    try {

        console.log(req.file); //^...it will print file details for single file
        
        const imageLinks = `https://example.com/uploads/profiles/${req.file.filename}`;

        //^  profile modeltype
        let newProfile = new Profile({
            image: imageLinks,
        });

        //^ save new profile image to databse
        newProfile = await  newProfile.save();

        res.status(200).json({ 
            profile: newProfile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//& middleware check for user profile already created or not
const checkProfile = async (req, res, next) => {
    try {
        //^ check username exist or not
        let profileExist = await Profile.findOne({ "userId": req.userid });

        if(!profileExist){
            next();
        }
        else{
            res.status(200).json({ 
                status:200,
                msg: " User has already created profile !"
            });
        }
 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//& create user profile
profileRouter.post("/api/create-profile", auth, checkProfile, async  (req, res) =>{

    const {username, originalName, bio}  = req.body;

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
            originalName,
            bio,
            image: null
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

    const {username, originalName, bio}  = req.body;

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
        profileExist.originalName = originalName;

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

//& delete account
profileRouter.get("/api/delete-account", auth, async (req, res) =>{
    
    try {
        let existingUser = await User.findByIdAndDelete(req.userid);
        if (!existingUser) {
            return res.status(500).json({
                status: 500,
                msg: "Internal server error, try later !"
            });
        }

        let existingProfile = await Profile.findByIdAndDelete({ "userId":req.userid });
        if (!existingProfile) {
            return res.status(500).json({
                status: 500,
                msg: "Internal server error, try later !"
            });
        }
        
        res.status(200).json({
            status: 200,
            msg:"Account deleted succesfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = profileRouter ;