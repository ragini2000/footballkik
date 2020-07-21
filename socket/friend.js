//Server Side File- to maintain friend request file
module.exports = function(io){
    io.on('connection', (socket) => {//whenever a user connects, socket.io connect event
        socket.on('joinRequest', (myRequest, callback) => {//listen the joinRequest event emitted from client side, that containes sender name
            socket.join(myRequest.sender);                 //as object
            
            callback();
         });  
         
         socket.on('friendRequest', (friend, callback) => {//to listen for the friendRequest event emitted from client side-sendrequest.js
            //to emit an event that only the receiver will be able to see/listen for this event- to add a real time notification
            io.to(friend.receiver).emit('newFriendRequest', {//we want to emit the event only to the receiver and hence "friend.receiver"
               from: friend.sender,//this data displayed in the console
               to: friend.receiver//this data displayed in the console
            }); 
            
            callback();//callback  is added to see the acknowledgement in the browser added in the client side
        });
    });
}