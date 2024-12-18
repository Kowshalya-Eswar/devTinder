const express = require('express');
const profileRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require('../middleware/auth');
const {validateEditData, validatePassword} = require('../utils/validation');
const bcrypt = require('bcrypt');
profileRouter.post("/profile", userAuth, async(req,res) => {
 
    try {
        const user = req.user
        res.send(user);
    }
    catch(err) {
      res.status(400).send('something went wrong..' +err.message);
    }
  });

  profileRouter.post("/user", async(req,res) => {

    try {
      const userEmail = req.body.emailId;
      console.log(userEmail);
      const user = await User.findOne({emailId:userEmail});
      if(!user) {
        res.status(404).send('user not found');
      } else {
        res.send(user);
      }
    } catch(err) {
      res.status(400).send('something went wrong..' +err.message);
    }
  });

  profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
 
    try {
        const isValidateEditData = validateEditData(req.body);
        if(!isValidateEditData) {
            throw new Error("Edit payload is not valid");
        }
        if (req.body.skills && req.body.skills.length > 5) {
            throw new Error("You cannot have more than 5 skills.");
          }
        Object.keys(req.body).forEach((val) => {
            req.user[val] = req.body[val];
        });
        await req.user.save();
        res.json({message: `${req.user.firstName}'s profile updated successfully`, userdetails:req.user});
       // res.send(req.user);
    }
    catch(err) {
      res.status(400).send('something went wrong..' +err.message);
    }
  });

  profileRouter.post("/resetPassword", userAuth, async(req,res) => {
    try {
        const isValidPassword = validatePassword(req.body);
        if (!isValidPassword) {
            throw new Error('password not valid');
        }
        console.log(req.user.emailId);
        console.log(req.body.password);
        req.user.password = await bcrypt.hash(req.body.password,10);
        await req.user.save();
       /* const result = await req.user.updateOne(
            { emailId: req.user.emailId },
            { $set: { password: req.body.password } }
        );
        console.log(result);
        if (!result) {
            throw new Error('password not updated');
        } else {
            res.json({message: "password updated successfully"});
        }*/
            res.json({message: "password updated successfully"});
    }  catch(err) {
        res.status(400).send('something went wrong..' +err.message);
      }
})

module.exports = profileRouter;