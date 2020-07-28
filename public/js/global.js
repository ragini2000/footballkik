//This is clent side file--holds jQuery code that will allow us to send data to server and also display data on the browser
$(document).ready(function(){
    var socket = io();
    
    socket.on('connect', function(){//global connect event when a user enters into the homePage 
        
        var room = 'GlobalRoom';//where the user logs in successfully
        var name = $('#name-user').val();//from home.ejs
        var img = $('#name-image').val();
        
        socket.emit('global room', {//automatically emitting the event once a user logs in
            room: room,
            name: name,
            img: img
        });
    });
});
