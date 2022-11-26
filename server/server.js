const path = require('path');
const express = require('express');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const http = require('http');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/IsRealString')
const {Users} = require('./utils/User')
const moment = require('moment');
console.log(moment().valueOf());
const publicPath = path.join(__dirname,"/../public");
const port = process.env.PORT || 3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);

let users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
     console.log("user joined");

     socket.on('join', (params, callback) => {
          if(!isRealString(params.user_name) || !isRealString(params.room_name)){
            return callback('Name and room are required');
          }
          socket.join(params.room_name);
          users.removeUser(socket.id)
          users.addUser(socket.id,params.user_name,params.room_name);
          io.to(params.room_name).emit('updateUserList',users.getUserList(params.room_name))
          socket.emit('newMessage',generateMessage("Admin",`welcome ${params.room_name}`))
          socket.broadcast.to(params.room_name).emit('newMessage',generateMessage("Admin",`${params.user_name} Joined the chat`))
          callback();
        })
     
     socket.on('createMessage',(message,callback) =>{
          let user = users.getUser(socket.id);
          if(user && isRealString(message.text)){
               io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
          }
          callback();
     })
     socket.on('createLocationMessage',(cords)=>{
          let user = users.getUser(socket.id);
          if(user){
               io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,cords.lat,cords.lon))
          }
     })
     socket.on('disconnect',()=>{
          let user = users.removeUser(socket.id);
          if(user){
               io.to(user.room).emit('updateUserList',users.getUserList(user.room));
               io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the chat`))
          }
     })
})
app.get('/',(req,res)=>{
     res.status(200).send({"status":200,"msg":"success"})
})
server.listen(port,()=>{
     console.log(`server is listening on ${port}`);
})
