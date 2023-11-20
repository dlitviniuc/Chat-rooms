const socket = io();

const roomTemplate = document.querySelector('#room-template').innerHTML;
const $sidebar = document.querySelector('#sidebar');
const $newRoom = document.querySelector('#create-room');
const $newRoomId = document.querySelector('#roomnum');
const $warRoon = document.querySelector('#paint-room');

const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true});
let rooms = [];
socket.on('rooms-data', data =>{
    rooms = data.rooms;
    let users = data.users;
    i=0;
    rooms.forEach(room => {
        const html = Mustache.render(roomTemplate, {
            roomnum: room,
            users: users[i]
        });
        i++;
        $sidebar.insertAdjacentHTML('beforeend', html);
    });
});

$newRoom.addEventListener('click', e=>{
    e.preventDefault();
    window.location.href=`../chat.html?username=${username}&room=${$newRoomId.value}`;
});

$warRoon.addEventListener('click', e=>{
    window.location.href=`../paint.html?username=${username}&room=war`;
});

document.addEventListener('click', e=>{
    const target = e.target.id;
    if(rooms.includes(target)){
        window.location.href=`../chat.html?username=${username}&room=${target}`;
    }
});

socket.emit('userLogged', error=>{
    if(error){
        alert(error);
        location.href('/');
    }
});