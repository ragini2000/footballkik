//server side
module.exports= function(io){
    io.on('connection',(socket)=>{
        socket.on('join PM',(pm)=>{//listen for the join PM event emitted from client side pm.js with the object pm coming from client side 
            socket.join(pm.room1);
            socket.join(pm.room2);

        });

        socket.on('private message',(message, callback)=>{
            //console.log(message);
            io.to(message.room).emit('new message',{//whoever is connected to this room channel will be able to listen 
                text: message.text,                 //newMessage event
                sender: message.sender
            });
            io.emit('message display',{});

            callback();
        });
    });
}