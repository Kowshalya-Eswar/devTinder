const express = require('express');
const Chat = require("../models/Chat");
const chatRouter = express.Router();
const {userAuth} = require('../middleware/auth');
chatRouter.get("/chat/:targetId",userAuth, async(req,res)=>{
    try {
        const userid = req.user._id;
        const targetId = req.params.targetId;
        const chat = await Chat.find({
            'participants': {$all:[userid,targetId]}
        }).populate({
            path: 'message.senderId',
            select: 'firstName lastName'
        }).sort({ "message.createdAt": -1 })  
      .limit(5); 
        if (chat.length === 0) {
            return res.status(404).json({ message: 'No chat found' });
        }
        res.status(200).json(chat);
    } catch(err) {
        res.status(500).send(err.message)
    }
    }
)

module.exports = chatRouter;
