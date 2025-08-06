const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin: "http://localhost:5173",
            credentials: true,
        }
    })
    io.on("connection", (socket)=>{
        socket.on("joinChat",(firstName, userId, targetUserId)=>{
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId);
            console.log(firstName + "joined"+roomId)
        })
        socket.on("sendMessage",()=>{})
        socket.on("disconnect",() =>{})
    })
}

module.exports = initializeSocket;