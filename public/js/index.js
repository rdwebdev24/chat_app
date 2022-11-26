
let socket = io();
socket.on('connect',()=>{
     console.log("connected to srever");
})
socket.on('connect', function() {
     let searchQuery = window.location.search.substring(1);
     let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
   
     socket.emit('join', params, function(err) {
       if(err){
         alert(err);
         window.location.href = '/';
       }else {
         console.log('No Error');
       }
     })
});

socket.on('updateUserList',(users)=>{
     console.log(users);
     let ol = document.createElement('ol');
     users.forEach((user)=>{
          let li = document.createElement('li');
          li.innerHTML = user;
          ol.appendChild(li);
     })
     let userList = document.querySelector('.user_cont');
     userList.innerHTML = "";
     userList.appendChild(ol);
})

function scrollTop(){
     let ele = document.querySelector('#messagediv').lastElementChild
     ele.scrollIntoView()
}
socket.on('newLocationMessage',(message)=>{
     let formatedDate = moment(message.createdAt).format('LT');
     const template = document.querySelector('#location-template').innerHTML;
     const html = Mustache.render(template,{
          from:message.from,
          url:message.url,
          createdAt:formatedDate
     });
     const div = document.createElement('div');
     div.setAttribute('class','message_div')
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
     const div = document.createElement('li');
     div.setAttribute('class','message_div')
     div.innerHTML = html
     document.querySelector('#messagediv').appendChild(div);
     scrollTop()
})


document.querySelector('#submit').addEventListener('click',(e)=>{
     e.preventDefault();
     socket.emit('createMessage',{
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