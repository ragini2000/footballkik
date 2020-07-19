//Server Side File--this will hold all the server code for group chat
module.exports=function(io,Users){//check server.js file line 33, using {Users} ES6 class
    //var users=[];//to be used to store the details of users connected to same channel {INSTEAD will be done using ES6 class}
    
    const users = new Users();//constructing new constructore from the Users class passed
    io.on("connection",function(socket){//listen for connection event of the user
        console.log("User connected");//this will be displayed in the console
        socket.on('join',(params,callback)=>{
            socket.join(params.room);//connect user to particular channel or room 
            //users.push(params.name);//to store the name of users connected to same room/channel {INSTEAD will be done using ES6 class}
            //users.push(params.room);//to store the room of users connected to same room/channel {INSTEAD will be done using ES6 class}
            //users.push(socket.id);//to store he name of users connected to same room/channel {INSTEAD will be done using ES6 class}
            users.AddUserData(socket.id, params.name, params.room);//use the AddUserData method of Users class to add new users data
            console.log(users);
            callback();
        });

        socket.on('createMessage',(message,callback)=>{//to listen "createMessage event"
            console.log(message);//returns data emitted from client side
            io.to(message.room).emit('newMessage',{//emit event to all the clients connected to a particular channel/room including the sender of the particular event
                text: message.text,//emitted a new event from the server
                room: message.room,
                from: message.sender
            });
            callback();
        });
    });  

}