//Creating helper    functions to handle users
const users=[];
const addUser = (currentUser)=>{
//Javascript Mastery = javasrciptmastery
let name=currentUser.name;
let room=currentUser.room;
let id = currentUser.id;
console.log(id, name, room);
name = name.trim().toLowerCase();
room = room.trim().toLowerCase();
console.log(id, name, room);

const existingUser= users.find((user)=> user.room===room && user.name===name );

if(existingUser){
    return {error:"user name already in use"};
}
const user = {id, name, room};
users.push(user);
return {user};
}
const removeUser = (id)=>{

const index = users.findIndex((user)=> user.id===id);
console.log(index+"is the index value");

if(index!==-1){   
    
    return (users.splice(index,1)[0]);
}
}
const getUser = (id)=>users.find((user)=> user.id===id);

const getUserInRoom = (room)=> users.filter((user)=> user.room ===room);

module.exports = {addUser, removeUser, getUser,getUserInRoom};