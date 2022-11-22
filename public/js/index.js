let socket = io();

socket.on('connect',()=>{
     console.log("connected to srever");
})
socket.on('disconnect',()=>{
     console.log("disconnected to srever");
})

socket.on('newMessage',(message)=>{
     console.log(message);
})

