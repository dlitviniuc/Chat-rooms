const mongoose = require('mongoose');
const User = require('./user');
var url = "mongodb://127.0.0.1:27017/chatUsers";
var db = undefined;
const connectDb = () =>{
    mongoose.connect(url, {useNewUrlParser: true});
    db = mongoose.connection;
    console.log("database connected");
}

const addUtente = async (data)=>{
    const user = new User(data);
    try{
        let query = await User.findOne({'username':data.username});
        if(!query){
            console.log('adding user');
            const newUser = await user.save();
            return true;
        }else{
            console.log("Username already in use");
            return false;
        }
    }catch(err){
        console.log(err.message);
    }
    return false;
}

const checkUser = async (data)=>{
    let ret = false;
    //console.log('Username: ', data.username);
    try{
        let query = await User.findOne({'username':data.username}, 'password');
        //console.log(query);
        if(query.password === data.password){
            //console.log("match found");
            ret = true;
        }
    }catch(err){
        console.log('Error on looking for user');
        console.log(err.message);
        ret = false;
    }
    return ret;
}

const closeDb = ()=>{
    db.close();
    console.log("Database connection closed");
}

module.exports = {
    connectDb,
    addUtente,
    checkUser,
    closeDb
}


