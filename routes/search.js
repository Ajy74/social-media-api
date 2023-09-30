const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profile_model");

const searchRouter = express.Router();

//& search user by username
searchRouter.get("/api/search", auth, async  (req, res) =>{

    const { username } = req.query ;

    try {

        let profileExist = await Profile.findOne({ username });

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

//& search user by original name
searchRouter.get("/api/search", auth, async  (req, res) =>{

    const { name } = req.query ;

    try {

        let profileExist = await Profile.find({ "originalName": name });

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

module.exports = searchRouter;