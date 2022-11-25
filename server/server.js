const path = require('path');
const express = require('express');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const http = require('http');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname,"/../public");
const port = process.env.PORT || 3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
     console.log("user joined");
     
     socket.emit('newMessage',generateMessage("Admin","welcome to the chat"))
     socket.broadcast.emit('newMessage',generateMessage("Admin","New User Joined"))
     socket.on('createMessage',(message,callback) =>{
          io.emit('newMessage',generateMessage(message.from,message.text))
          callback();
     })
     socket.on('createLocationMessage',(cords)=>{
          io.emit('newLocationMessage',generateLocationMessage("Admin",cords.lat,cords.lon))
     })
     socket.on('disconnect',()=>{
          console.log("user disconnected");
     })
})
app.get('/',(req,res)=>{
     res.status(200).send({"status":200,"msg":"success"})
})
server.listen(port,()=>{
     console.log(`server is listening on ${port}`);
})
