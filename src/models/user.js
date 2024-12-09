const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        required:true
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
        default: "https:/test"
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