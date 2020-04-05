const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {addUser, removeUser, getUser, getUserInRoom} = require('./users');

const PORT = process.env.PORT || 5000;
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(router);

//io.on() tells that we have a connection
//A socket is assigned to that particular user
io.on("connection", (socket) => {
  console.log("We have a connection!!!");
    socket.on("join",({name, room},callback)=>{
      console.log(name+"----"+room);
      
      const {error, user} = addUser({id:socket.id, name:name, room:room});

      if(error) return callback(error);

      socket.join(user.room);

      //admin will emit "message" event to welcome the user
      socket.emit('message',{user:"admin", text:`${user.name}, welcome to the room ${user.room}`});
      //admin will inform other users about the new joining of the user
      socket.broadcast.to(user.room).emit('message',{user:"admin", text:`${user.name} has joined!`});

      io.to(user.room).emit('roomData',{room:user.room, users:getUserInRoom(user.room)});
      
      callback();
    });
    //Listening for sendMessage event
    socket.on('sendMessage',(message,callback)=>{
      const user = getUser(socket.id);  
      io.to(user.room).emit('message',{user:user.name, text:message});
      
      callback();
    });

    //seek if user is typing 
    socket.on('userIsTyping',(typing)=>{
      const user = getUser(socket.id);  
      console.log(user.name+"is typing");
      socket.broadcast.to(user.room).emit('userIsTyping',{user:user.name,typing:typing});
    });

    socket.on("disconnect", () => {
    // console.log("User has disconnected!");
    
    // console.log(socket.id+"is the id");
    const user = removeUser(socket.id);
    if(user){
      // console.log("user is available");
      io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room`});
      io.to(user.room).emit('roomData',{room:user.room, users:getUserInRoom(user.room)})
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server started at port:${PORT}`);
});
