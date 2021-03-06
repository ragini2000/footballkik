//server side file- for global room
module.exports = function(io, Global, _){
    const clients = new Global();//we can get access to the Glpbal class method created in helpers/Global.js
    
    io.on('connection', (socket) => {//listen to the global connection event
        socket.on('global room', (global) => {//listen global.room event
            socket.join(global.room);//user auomatically joins the globalRomm
            
            clients.EnterRoom(socket.id, global.name, global.room, global.img);//successfully logged in users details stored in the array
                                                                               //using EnterRoom method of helpers/Global.js
            //fetching the data of all the users connected to the global room to emit teir name and image on the client side
            const nameProp = clients.GetRoomList(global.room);//get the details of the users connected in an object array
            const arr = _.uniqBy(nameProp, 'name');//lodash method to remove duplicates entries from nameProp array, it will have unique 'name'
            //console.log(arr);
            io.to(global.room).emit('loggedInUser', arr);// the value of arr that contains connected users details will be emiited and can be
            //listen in the client side and then displayed in the browser who all are online
        });
        
        socket.on('disconnect', () => {//to remove user from the list of online friends when a user logs out/disconnect from globalroom
            const user = clients.RemoveUser(socket.id);//socket.id of the user that disconnects
            
            if(user){//if user exists
                var userData = clients.GetRoomList(user.room);//retreive user data from user room
                const arr = _.uniqBy(userData, 'name');//to remove duplicates
                const removeData = _.remove(arr, {'name': user.name})//removes the user data (of logged out user) automatically from the arr
                io.to(user.room).emit('loggedInUser', arr);//emit updated arr after deletion of logged out user data
            }
        })
    });
}
