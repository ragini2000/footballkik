//Server Side File--this will hold all the server code for group chat
module.exports=function(io){
    io.on("connection",function(socket){//listen for connection event of the user
        console.log("User connected");//this will be displayed in the console
        socket.on('createMessage',(message)=>{//to listen "createMessage event"
            console.log(message);//returns data emitted from client side
            io.emit('newMessage',{//emit event to all the clients connected to a particular channel including the sender of the particular event
                text: message.text//emitted a new event from the server
            });
        });
    });  

}