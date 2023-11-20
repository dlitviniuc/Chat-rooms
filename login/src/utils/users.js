const users = [];

const addUser = ({id, username, room})=>{
    try{
        username = username.trim().toLowerCase();
        room = room.trim().toLowerCase();
    }catch(error){
        console.log(error.message);
    }
    if (!username || !room){
        return {
            error: "Username and room are required!"
        };
    }
    const existingUser = users.find(user => {
        return user.room === room && user.username === username;
    });
    if(existingUser){
        return {
            error: "Username is already in use!"
        };
    }
    const user = {id, username, room};
    users.push(user);
    return {user};
};

const removeUser = id=>{
    const index = users.findIndex(user => user.id === id);

    if (index !== -1){
        return users.splice(index, 1)[0];
    }
};

const getUser = id =>{
    return users.find(user=>user.id===id);
};

const getUsersInRoom = room =>{
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
};

const getRooms = rooms =>{
    r = [];
    u = [];
    users.forEach(user=>{
        if(!r.includes(user.room)){
            r.push(user.room);
            u.push(1);
        }else{
            i=0;
            r.forEach(room=>{
                if(room===r[i]){
                    u[i]++;
                }
                i++;
            });
        }
    });
    return {rooms:r,users:u};
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
};


