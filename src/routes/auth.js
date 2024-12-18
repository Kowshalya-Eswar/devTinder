const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");

const {validateData} = require('../utils/validation');
const bcrypt = require('bcrypt');
authRouter.post("/signup", async (req,res) => {
    //create new instance of user modal
    const UserObj = req.body;
    const {firstName, lastName, gender, emailId, password, age} = req.body;
   // console.log(UserObj);
    const user = new User(UserObj);
    
    try {
      validateData(UserObj);
      const passwordHash = await bcrypt.hash(password,10);
      console.log(passwordHash);
      const user = new User({
        firstName,
        lastName,
        gender,
        emailId,
        age,
        password: passwordHash
      });
      await user.save();
      res.send("User Added successfully");
    } catch(err) {
      res.status(400).send("error saving user:"+ err.message);
    }
  
  })

authRouter.post("/login", async(req,res) => {
    const {emailId, password} = req.body;
  
    try {
  
        const user = await User.findOne({emailId: emailId});
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const isPasswordValid = await user.isPasswordValidate(password);
        if (!isPasswordValid) {
         
          throw new Error('Invalid credentials');
        } else {
          const token = await user.getJWT();
          res.cookie("token",token, {expires: new Date(Date.now() +8 * 360000)} );
          res.send("Login succesfull");
        }
      }
    catch(err) {
      res.status(400).send('something went wrong..' +err.message);
    }
  });

authRouter.post("/logout",async(req,res)=> {
    res.cookie('token', null, {expires: new Date(Date.now())
    })
    .send("logout successfull");

});
  
module.exports = authRouter;