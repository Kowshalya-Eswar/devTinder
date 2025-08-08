const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   text: {
     type: String,
     required: true
   },
   senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
   }
}, {timestamps:true})

const chatSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        required: true
    }],
    message: [messageSchema]

})

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat