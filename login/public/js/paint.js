const socket = io();

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;
//const imgTemplate = document.querySelector('#image-template').innerHTML;
const canvas = document.getElementById('image');
const context = canvas.getContext("2d");
const $cell = document.getElementById('cell');
//const $map = document.getElementById('map');
let $color = "#ff0000";
let offset = 0;
const x0 = 230, y0 = 30;
const imgw = 1280, imgh = 720;
function getColorVal(){
    console.log('color: ',document.getElementById('color').value)
    $color = document.getElementById('color').value;
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.round(x/5);
    y = Math.round(y/5);
    //console.log("x: " + x + " y: " + y)
    return {i:x, j:y};
}

canvas.addEventListener('click', (e)=>{
    let data = getCursorPosition(canvas, e);
    data.color = $color;
    socket.emit('changeMap', data);
});

socket.on('updateMap', image=>{
    let img = new Image(256, 144);
    img.onload=()=>{
        context.clearRect(0,0,imgw,imgh);
        canvas.width=imgw;
        canvas.height=imgh;
        console.log('drawing image');
        console.log(`img w: ${img.width} img h: ${img.height} desired w: ${imgw} h: ${imgh}`);
        context.imageSmoothingEnabled=false;
        context.drawImage(img,0,0,imgw,imgh);
    }
    img.src = image;
    img.onerror = function() {console.log("Image failed");};
});

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebarusers').innerHTML = html;
});

socket.emit('join', {username, room}, error =>{
    if(error){
        alert(error);
        location.href = '/';
    }
});
