const express = require('express');
const requestRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/ConnectionRequest");
const {userAuth} = require('../middleware/auth');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            throw new Error("user not found");
        }
        const isAllowedStatus = ["ignored","interested"].includes(status);
        if(!isAllowedStatus) {
            throw new Error("not a valid status");
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:
            [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest) {
            throw new Error("Already connection exists");
        }
        const connectionData = new ConnectionRequest({fromUserId: fromUserId, toUserId: toUserId, status:status});
        await connectionData.save();
        res.send(req.user.firstName+ " sending connection request to " + toUser.firstName);
    } catch (err) {
        res.status(404).send("Error:"+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) => {
    try {
        const {status,requestId} = req.params;
        const userLoggedIn = req.user;
        console.log(userLoggedIn._id);
        allowedStatus = ["accepted","rejected"].includes(status);
        if(!allowedStatus) {
            return res.status(400).send({status:false,message:"send proper status"});
        }
        const connectionReq = await ConnectionRequest.findOne({
            toUserId:userLoggedIn._id,
            status:'interested',
            fromUserId:requestId
        })
        if(!connectionReq) {
            return res.status(400).send({status:false,message:"connection not found"});
        }
        connectionReq.status = status;
        await connectionReq.save();
        res.send({status:true,message:"connection accepted"})
    } catch(error) {
        res.status(404).send("Error:"+error.message);
    }
});

module.exports = requestRouter;

