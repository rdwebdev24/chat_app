 let expect = require('expect').expect;
 var {generateMessage,generateLocationMessage} = require('./message');

 describe('Generate Message',()=>{
     it("should generate correct message object",()=>{
          let from = "John",
               text = "some text"
               message = generateMessage(from ,text);

     expect(typeof message.createdAt).toBe('number');
     expect(message).toMatchObject({from,text});
     })
 })

 describe('Generate Location Message',()=>{
     it("should generate correct Location object",()=>{
          let from = "John",
               lat=15,
               lon=56,
               url=`https://www.google.com/maps?q=${lat}${lon}`
               message = generateLocationMessage(from ,lat,lon);

     expect(typeof message.createdAt).toBe('number');
     expect(message).toMatchObject({from,url});
     })
 })