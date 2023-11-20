const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom, getRooms} = require('./utils/users');
const {connectDb,addUtente,checkUser,closeDb} = require('./utils/database');
const {createWhiteImg,setImage,putPixel} = require('./utils/map');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
let warOpen = 0;
let image = undefined;
require('dotenv').config();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

async function setup(){
    connectDb();
    if(await createWhiteImg()){
        image = await setImage();
    }
}
setup();

function checkChanges(data){
    image = putPixel(data);
    //console.log("image: ",image);
}

function updateMap(socket){
    if(warOpen>0){
        console.log('update');
        socket.emit('updateMap', image);
    }
}

io.on("connection", socket=>{
    console.log('New WebSocket connection');
    socket.on('join', (options, callback)=>{
        const {error, user} = addUser({id:socket.id, ...options});
        if(error){
            return callback(error);
        } else{
            socket.join(user.room);
            if(user.room==='war'){
                socket.emit('updateMap',image);
                console.log('user joined war room');
                warOpen++;
            }else{
                socket.emit("message", generateMessage('Admin, "Welcome!'));
                socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
            }
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
            callback();
        }
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();
    
        if (filter.isProfane(message)) {
          return callback("Profanity is not allowed!");
        } else {
          io.to(user.room).emit("message", generateMessage(user.username, message));
          callback();
        }
      });

    socket.on("sendLocation", (coords, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`));
        callback();
    });
    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left the chat. :(`));
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room)
            });
            if(user.room==='war'){
                console.log('user leaving war room');
                warOpen--;
            }
        }
    });
    socket.on("login", async (data)=>{
        //console.log(data);
        let found = await checkUser({username:data.username, password:data.password}); 
        if(found){
            //console.log("username ",data.username);
            console.log("logged");
            io.to(socket.id).emit('logged',  {username:data.username, room:data.room});
            //io.emit('logged', {username:data.username, room:data.room});
        }else{
            console.log("BadData");
            io.to(socket.id).emit('BadData');
        }
    });
    socket.on('register',async (data)=>{
        //console.log(data);
        let found = await checkUser(data);
        let valid = false;
        if(!found){
            //console.log(data.username);
            if(await addUtente(data)){
                console.log("registered");
                io.to(socket.id).emit('registered');
                valid = true;
            }
        }
        if(!valid)
            await io.to(socket.id).emit('BadReg');
    });
    socket.on('userLogged', ()=>{
        data = getRooms();
        socket.emit('rooms-data', data);
    });
    socket.on('changeMap', data=>{
        console.log(data);
        checkChanges(data);
    });
    setInterval(()=>{
        updateMap(socket);
    }, 5*1000);
});

server.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}!`);
});

process.on('exit', ()=>{
    closeDb();
});