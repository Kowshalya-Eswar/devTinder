const express = require('express');
const userRouter = new express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/ConnectionRequest");
const {userAuth} = require("../middleware/auth");
const { connect } = require('mongoose');
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

    userRouter.get('/request/pending', userAuth, async(req,res) =>{
        try {
            const userLoggedIn = req.user;
            const connectionRequests = await ConnectionRequest.find ({
                toUserId: userLoggedIn._id,
                status: "interested"
            })
            //.populate("fromUserId",["firstName","lastName"]);
            .populate("fromUserId","firstName lastName photoURL");
            if(!connectionRequests) {
                return res.status(400).send("No pending connections");
            } 
            res.json({message:"pending requests", data:connectionRequests});

        } catch (error) {
            res.status(400).send('something went wrong..' +error.message);
        }
    });

    userRouter.get('/connections', userAuth, async(req,res) =>{
        try {
            const userLoggedIn = req.user;
            const connectionRequests = await ConnectionRequest.find ({
                $or:
                [ {
                        toUserId: userLoggedIn._id,
                        status: "accepted"
                    },
                    {
                        fromUserId: userLoggedIn._id,
                        status: "accepted"

                    } ]
            })
               
            //.populate("fromUserId",["firstName","lastName"]);
            .populate("fromUserId","firstName lastName photoURL")
            .populate("toUserId","firstName lastName photoURL");
            if(!connectionRequests) {
                return res.status(400).send("No connections");
            } 
           console.log(connectionRequests);
           const connectionReq = connectionRequests.map(row=> {
            if(userLoggedIn._id.toString() === row.fromUserId._id.toString() ) {
                return row.toUserId
            }
                return row.fromUserId
            });
            res.json({message:"connections", data:connectionReq});

        } catch (error) {
            res.status(400).send('something went wrong..' +error.message);
        }
    });

    module.exports = userRouter;