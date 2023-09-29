const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const Post = require("../models/post_model");
const Profile = require("../models/profile_model");

// const upload = multer({ dest: "uploads/" }); // Destination folder for uploaded files
const postRouter = express.Router();


// //& middleware for single image(.jpg) upload using multer
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, callback){
//             callback(null, "uploads/")
//         },
//         filename: function (req, file, callback) {
//             callback(null, file.fieldname + "_" + Date.now() + ".jpg")
//         }
//     })
// }).single("files");

//& middleware for multiple files(any type) upload using multer
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback){
            callback(null, "uploads/")
        },
        // filename: function (req, file, callback) {
        //     callback(null, file.fieldname + "_" + Date.now() + ".jpg")
        // }
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + `${file.originalname}`)
        }
    })
}).array("user_files", 10);

//& upload new post
postRouter.post("/api/new-post", auth, upload, async(req, res) =>{
    try {
        // const { type, desc, tags, files } = req.body; 
        const { type, desc, tags} = req.body; 
        
        console.log(req.files); //^...it will print file details for multiple files
        // console.log(req.file); //^...it will print file details for single file
        // console.log(req.file.path); //^...it will print file path for single file
        
        if (String(type) !== "image" && String(type) !== "video" && String(type) !== "sponsor") {
            return res.status(400).json({
                status: 400,
                msg: "Please Specify Correct Post Type as (image, video, sponsor)!"
            });
        }
      

        //^ Check if files are uploaded
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                status: 400,
                msg: "Please upload at least one file!"
            });
        }

        //^ generate/creating post links after uploading somewhere and store in the array
        const postLinks = req.files.map((file) => `https://example.com/uploads/${file.filename}`); // Replace 'example.com' with your actual server domain

        let newPost = new Post({
            userId: req.userid,
            type,
            desc,
            tags,
            url: postLinks // Store array of file links in the 'url' field
        });
        newPost = await newPost.save();
        
        //^ updating post count of current user
        let userprofile = await Profile.findOne({ userId: req.userid });
        userprofile.postCount += 1;
        userprofile = await userprofile.save();

        return res.status(200).json({
            post: newPost,
            msg: "Post uploaded successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = postRouter;


// //& upload new post
// postRouter.post("/api/new-post", auth, async(req, res) => {
//     try {
//         const { type, desc, tags, files } = req.body; 
//         console.log(req.body);
//         console.log(typeof type);
        
//         if (type !== "image" && String(type) !== "video" && String(type) !== "sponsor") {
//             return res.status(400).json({
//                 status: 400,
//                 msg: "Please Specify Correct Post Type as (image, video, sponsor)!"
//             });
//         }
      

//         //^ Check if files are uploaded
//         if (!files || !Array.isArray(files) || files.length === 0) {
//             return res.status(400).json({
//                 status: 400,
//                 msg: "Please upload at least one file!"
//             });
//         }

//         //^ generate post links after uploading somewhere and store in the array
//         const postLinks = files.map((file) => `https://example.com/uploads/${file.filename}`); // Replace 'example.com' with your actual server domain

//         let newPost = new Post({
//             userId: req.userid,
//             type,
//             desc,
//             tags,
//             url: postLinks // Store array of file links in the 'url' field
//         });
//         newPost = await newPost.save();
        
//         //^ updating post count of current user
//         let userprofile = await Profile.findOne({ userId: req.userid });
//         userprofile.postCount += 1;
//         userprofile = await userprofile.save();

//         return res.status(200).json({
//             post: req.body,
//             msg: "Post uploaded successfully"
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = postRouter;
