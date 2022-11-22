const path = require('path');
const express = require('express');
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
     
     socket.emit('newMessage',{
          from:"Admin",
          text:"swagat hai bsdk",
          createdAt:new Date().getTime()
     })
     socket.broadcast.emit('newMessage',{
          from:"Admin",
          text:"naya chutiya aa gya",
          createdAt:new Date().getTime()
     })
     socket.on('createMessage',(message) =>{
          // console.log("message : ",message);
          // io.emit('newMessage',{
          //      from:message.from,
          //      text:message.text,
          //      createdAt:new Date().getTime()
          // })
          socket.broadcast.emit('newMessage',{
               from:message.from,
               text:message.text,
               createdAt:new Date().getTime()
          })
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
