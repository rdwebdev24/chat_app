let generateMessage = (from,text) => {
     return {
          from,
          text,
          createdAt:new Date().getTime()
     }
}
let generateLocationMessage = (from,lat,lon) => {
     console.log(lat,lon,"fdasgsdgd");
     return {
          from,
          url:`https://www.google.com/maps?q=${lat}${lon}`,
          createdAt:new Date().getTime()
     }
}
module.exports = {generateMessage,generateLocationMessage}