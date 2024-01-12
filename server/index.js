const express = require('express');
const app = express();
const http= require("http");
const cors =require("cors");
const {Server}=require("socket.io");

app.use(cors())


const server=http.createServer(app)

const io= new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
})

io.on('connection', (socket) => {
    socket.on("send-message", (message)=>{
    console.log("message",message)
    io.emit("Received-message",message)
    
    })
    socket.on("disconnet",()=>console.log("user disconnected"))

});

server.listen(5000, () => {
    console.log('server running at http://localhost:5000');
  });