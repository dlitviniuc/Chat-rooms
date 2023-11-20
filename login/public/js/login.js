const socket = io();
const $loginButton = document.querySelector("#login");

$loginButton.addEventListener("click", e =>{
    e.preventDefault();
    const usr = document.getElementById('username').value;
    const pwd = document.getElementById('password').value;
    const message = {
        username:usr,
        password:pwd,
    };
    socket.emit('login', message, error=>{
        $username = "";
        $password = "";
        document.querySelector('#BadData').setAttribute('visibility', 'visible');
    });
});

socket.on('logged', (data)=>{
    window.location.href=`../rooms.html?username=${data.username}`;
});

socket.on('BadData', ()=>{
    console.log('bad data login')
    document.querySelector('#BadData').setAttribute('visibility', 'visible');
});

