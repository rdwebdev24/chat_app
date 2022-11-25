
let socket = io();

socket.on('connect',()=>{
     console.log("connected to srever");
})
socket.on('disconnect',()=>{
     console.log("disconnected to srever");
})

socket.on('newLocationMessage',(message)=>{
     console.log(message);
     let a = document.createElement('a');
     let li = document.createElement('li');
     a.setAttribute('target',"_blank");
     a.setAttribute('href',message.url);
     a.innerText = 'my location';
     li.appendChild(a);
     document.querySelector('body').append(li);
})
socket.on('newMessage',(message)=>{
     console.log(message);
     let li = document.createElement('li');
     li.innerHTML = `${message.from} : ${message.text}`;
     document.querySelector('body').append(li);
})



document.querySelector('#submit').addEventListener('click',(e)=>{
     e.preventDefault();
     socket.emit('createMessage',{
          from:"user",
          text:document.querySelector('#message').value
     },()=>{
          console.log("server git it");
     })
     document.querySelector('#message').value = ''
})

document.querySelector('#send-location').addEventListener('click',()=>{
     if(!navigator.geolocation){
          return alert("Geolocation is not supported by your browser");
     }
     navigator.geolocation.getCurrentPosition((position)=>{
          console.log(position);
          socket.emit('createLocationMessage',{
               lat:position.coords.latitude,
               lon:position.coords.longitude,
          })
     },()=>{
          alert('unalble to fetch location')
     })
})