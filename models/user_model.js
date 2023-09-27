const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        trim: true,
    },
    email:{
        required: true,
        trim: true,
        type: String,
        validate: {
            validator : (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: 'Please enter a valid email address',
        }
    },
    gender:{
        type: String,
        trim: true,
        required: true,
    },
    password:{
        type: String,
        trim: true,
        required: true,
        validate: {
            validator : (value) => {
                return value.length > 6;
            },
            message: "Please enter password length greater than 6 character",
        }
    },
    type:{
        trim: true,
        type: String,
        default: 'user',
    }
});


const User = mongoose.model("User", userSchema);
module.exports = User;