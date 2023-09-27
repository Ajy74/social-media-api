const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const authRouter = express.Router();

//& initial api
authRouter.get("/", async (req, res) => {
    try {
        const user = await User.findById(req.user);
        res.json({ ...user._doc, token: req.token });
    } catch (error) {
        res.status(400).json({
            status: "400",
            msg: "Bad Request !"
        });
    }
});

//& signup api
authRouter.post("/api/signup", async(req, res)=>{
    //^ getting values from request
    const {name, email, password, gender} = req.body ;

    //^ checkup existing user
    const isUserExist = await User.findOne({ email });

    try {
        if(isUserExist){
            return res.status(400).json({
                msg: "Email already exist !",
                status: '400',
            });
        }
        
        //^ converting password to hash password
        const hashedPassword = await bcryptjs.hash(password, 8);

        //^ creating a new user of type userModel
        let newUser = new User({
            name,
            email,
            password: hashedPassword,
            gender,
        });

        //^ save new user to database
        newUser = await newUser.save();

        //^ send response to this request
        res.status(200).json(newUser);
                
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

authRouter.get("/api/signup", async (req, res) =>{
    res.status(400).json({
        msg: "Bad request ! use POST method ",
        status: "400",
    });
});


//& signin api
authRouter.post("/api/signin", async (req, res) =>{
    try {
        //^ getting data from request
        const {email, password} = req.body ;

        //^ check for user exist or not
        const user = await User.findOne( { email } );
        if( !user ){
            return res.status(400).json({
                status:"400",
                msg:"user does not exist with this email !"
            });
        }

        //^ now match password
        const isPasswordMatch = await bcryptjs.compare( password, user.password );
        if(!isPasswordMatch){
            return res.status(400).json({
                msg: "Incorrect Password !",
            });
        }

        //^ generating token for singed user
        const token =  jwt.sign({ id: user._id }, "verificationKey");  //secret key is here
        res.json({token, ...user._doc});  //^ ... ?

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});
authRouter.get("/api/signin", async (req, res) =>{
    res.status(400).json({
        msg: "Bad request ! use POST method ",
        status: "400",
    });
});

module.exports = authRouter;