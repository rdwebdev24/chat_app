
let socket = io();
socket.on('connect',()=>{
     console.log("connected to srever");
})
socket.on('disconnect',()=>{
     console.log("disconnected to srever");
})

socket.on('newLocationMessage',(message)=>{
     let formatedDate = moment(message.createdAt).format('LT');
     const template = document.querySelector('#location-template').innerHTML;
     const html = Mustache.render(template,{
          from:message.from,
          url:message.url,
          createdAt:formatedDate
     });
     const div = document.createElement('div');
     div.setAttribute('id','message_div')
     div.innerHTML = html
     document.querySelector('#messagediv').appendChild(div);
})
socket.on('newMessage',(message)=>{
     let formatedDate = moment(message.createdAt).format('LT');
     const template = document.querySelector('#message-template').innerHTML;
     const html = Mustache.render(template,{
          from:message.from,
          text:message.text,
          createdAt:formatedDate
     });
     const div = document.createElement('div');
     div.setAttribute('id','message_div')
     div.innerHTML = html
     document.querySelector('#messagediv').appendChild(div);
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

document.querySelector('#send-location').addEventListener('click',(e)=>{
     e.preventDefault();
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