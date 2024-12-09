const mongoose = require('mongoose');
const validator = require('validator');
const userSchema  = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3,
        maxLength:10
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("not a strong password")
            }
        }
    },
    age: {
        type: Number,
        min:18,
        max:60,
        required:true,
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male','female','others'].includes(value)) {
                throw new Error("Random string in gender");
            }
        }
    },
    skills : {
        type: [String],
    }, 
    photoURL: {
        type: String,
        default: "https:/test",
       validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("invalid url");
            }
        }
    },
    description: {
        type: String,
        default: "About you"
    },
   },
   {
    timestamps: true,
});

const User  = mongoose.model("User", userSchema);

module.exports = User;