//Server Side File--this will hold all the server code for group chat
module.exports=function(io){
    io.on("connection",function(socket){//listen for connection event of the user
        console.log("User connected");//this will be displayed in the console
        socket.on('join',(params,callback)=>{
            socket.join(params.room);//connect user to particular channel or room
            callback();
        });

        socket.on('createMessage',(message,callback)=>{//to listen "createMessage event"
            console.log(message);//returns data emitted from client side
            io.to(message.room).emit('newMessage',{//emit event to all the clients connected to a particular channel/room including the sender of the particular event
                text: message.text,//emitted a new event from the server
                room: message.room
            });
            callback();
        });
    });  

}