const socket = io();

const $registerButton = document.querySelector('#register');

$registerButton.addEventListener('click', ()=>{
    const usr = document.getElementById('username').value;
    const pwd = document.getElementById('password').value;
    const message = {
        username:usr,
        password:pwd
    };
    socket.emit('register',message, error=>{
        $username = "";
        $password = "";
        document.querySelector('#BadData').setAttribute('visibility', 'visible');
    });
});

socket.on('registered', ()=>{
    window.location.href = "../index.html";
});

socket.on('BadReg', ()=>{
    console.log('wrong registration info');
});