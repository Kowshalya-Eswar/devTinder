const socket = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin: "http://localhost:5173",
            credentials: true,
        }
    })
    io.use((socket,next)=>{
       
        const cookies = socket.handshake.headers.cookie;
        if(!cookies) {
            return next(new Error("no cookies found"));
        }
        const parsedCookies = cookie.parse(cookies);
        const token= parsedCookies.token;
        if(!token) {
            return next(new Error("no token found"));
        }
        try {
            const decoded = jwt.verify(token, "234@#");
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error('Invalid token'));
        }
    })
    io.on("connection", (socket)=>{
        socket.on("joinChat",({firstName, id})=>{
            const roomId = [socket.user.userid, id].sort().join("_");
            socket.join(roomId);
            console.log(firstName + "joined"+roomId)
        })
        socket.on("sendMessage",async({firstName, id, text})=>{
            const roomId = [socket.user.userid, id].sort().join("_");
            io.to(roomId).emit("messageReceived",{firstName, text})
            console.log(firstName +":"+text);
            try {
                let chat = await Chat.findOne({'participants': {$all:[socket.user.userid,id]}});
                if(!chat) {
                    chat = new Chat({
                        'participants':[socket.user.userid,id],
                        'message':[{
                            'senderId':socket.user.userid, 
                            'text':text}]
                    })
                    await chat.save();
                } else {
                    chat.message.push({
                        'senderId':socket.user.userid, 
                        'text':text})
                   await chat.save();
                }
            } catch(err) {
                console.log(err);
            }

        })
        socket.on("disconnect",() =>{})
    })
}

module.exports = initializeSocket;