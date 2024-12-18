const express = require('express');
const profileRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require('../middleware/auth');
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

module.exports = profileRouter;