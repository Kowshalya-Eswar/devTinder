const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin: "http://localhost:5173",
            credentials: true,
        }
    })
    io.on("connection", (socket)=>{
        socket.on("joinChat",({firstName, userId, id})=>{
            const roomId = [userId, id].sort().join("_");
            socket.join(roomId);
            console.log(firstName + "joined"+roomId)
        })
        socket.on("sendMessage",({firstName, userId, id, text})=>{
            const roomId = [userId, id].sort().join("_");
            io.to(roomId).emit("messageReceived",{firstName, text})
            console.log(firstName +":"+text);

        })
        socket.on("disconnect",() =>{})
    })
}

module.exports = initializeSocket;