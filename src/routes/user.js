const express = require('express');
const userRouter = new express.Router();
const User = require("../models/user");
//Feed API - GET /feed - get all the data
userRouter.get("/feed", async(req,res) => {

    try {
        const user = await User.find({});
        res.send(user);
        }
    catch(err) {
        res.status(400).send('something went wrong..' +err.message);
    }
    });
    
    userRouter.delete('/deleteUser', async(req,res) => {
    try {
        const userId = req.body.userId;
        const id = await User.findByIdAndDelete({_id:userId});
        //const id = await User.findByIdAndDelete(userId); //same as above
        res.send("user deleted successfully");
    }  catch(err) {
        res.status(400).send('something went wrong..' +err.message);
    }
    })
    
    userRouter.patch('/updateUser/:emailId',async(req,res)=>{
    try {
        const emailId = req.params?.emailId;
        data = req.body;
        const ALLOWED_UPDATES = ['userId','photoURL','gender','skills','age'];
        const isUpdateAllowed = Object.keys(data).every((k) => 
        ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed) {
        throw new Error("update not allowed");
        }
        if(data?.skills.length() > 10) {
        throw new Error("skills should not greater than 10");
        }
        /* userbefore = await User.findByIdAndUpdate({_id: userId},data, {
        returnDocument: "before"
        });*/
        userbefore = await User.findOneAndUpdate({emailId: emailId},data, {
        returnDocument: "before",
        runValidators:true
        });
        console.log(userbefore);
        res.send("user updated successfully");
    } catch(err) {
        res.status(400).send('something went wrong..' +err.message);
    }
    })

    module.exports = userRouter;