const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req,res,next) => {
    console.log("Authorization middle ware");
    const token = "abc";
    const isAdminUser = "abc" === token;
    if (isAdminUser) {
        next();
    } else {
        res.status(401).send("unauthorized access");
    }
};

const userAuth = async (req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
           return res.status(401).send("User not authorized");
        }
        const parsedToken = await jwt.verify(token,"234@#");
        const {userid} = parsedToken;
        const user = await User.findById(userid);
        if(user) {
            req.user = user;
            next();
        } else {
            throw new Error("user not found");
        }
    } catch(err) {
        res.status(404).send("Error: "+err.message);
    }
}

module.exports ={   
     adminAuth,
     userAuth
}