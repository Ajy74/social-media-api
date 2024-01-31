require("dotenv").config();
//& imports
const express = require("express");
const mongoose = require("mongoose");

//& imports from other file
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const followRouter = require("./routes/follow");
const postRouter = require("./routes/posts");
const searchRouter = require("./routes/search");

//& initialization
const PORT = process.env.PORT ||4000;
const app = express();
const DATABASE = "mongodb+srv://mouryaajay7463:ajay123@cluster0.wiiwbjx.mongodb.net/?retryWrites=true&w=majority";


//& middleware 
app.use(express.json());
app.use(authRouter);
app.use(profileRouter);
app.use(followRouter);
app.use(postRouter);
app.use(searchRouter);

// app.use(express.urlencoded({ extended: false}));



//& connection
mongoose.connect(DATABASE)
.then(() =>{
    console.log("Database connected 👍");
}).catch((e) =>{
    console.log(">>>Database Connection Error<<<\n"+e.message);
});

//& listening to current port
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Connection started on port ${PORT}`);
});