const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profile_model");

const searchRouter = express.Router();


//& middleware to check for user by username
const checkUsername = async (req, res, next) => {
    const { username } = req.query ;

    try {

        let profileExist = await Profile.findOne({ username });

        if(!profileExist){
            next();
        }
        else{
            res.status(200).json({ 
                profile: profileExist
            });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//& search user by original name
searchRouter.get("/api/search", auth, checkUsername, async  (req, res) =>{

    const { name } = req.query ;

    try {

        let userExist = await Profile.find({ "originalName": name });

        if(!userExist){
            return res.status(400).json({ 
                status: 400,
                msg: "Profile not found !"
            });
        }
        
        res.status(200).json({ 
            profile: userExist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = searchRouter;