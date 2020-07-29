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

    socket.on('loggedInUser', function(users){//to listen loggedInUser event emitted from socket/globalroom.js
        
        var friends = $('.friend').text();//we want to get text from the div which is hidden(class name friend) friends="@friend1""@friend2"
        var friend = friends.split('@');//split the above retrieved text at '@'  then friend=["@","friend1","friend2"]
        
        var name = $('#name-user').val().toLowerCase();
        var ol = $('<div></div>');
        var arr = [];//will contain friends that are online
        //loops through the user array coming from server side and checks if the user with the given name property is found inside the 
        //friend array then push that user into array and append the name to ol which contains empty div 
        for(var i = 0; i < users.length; i++){
        //indexof javascript method checks if the value exists inside an index and return the position of that value else returns -1
            if(friend.indexOf(users[i].name) > -1){//we are searching for the above name (at line 21) inside the friend array
                arr.push(users[i]);
                ol.append(users[i].name);
            }
        }
        $('#numOfFriends').text('('+arr.length+')');//in element with numofFriends i.e no. of friends online display it as --> (arr.length)
        $('.onlineFriends').html(ol);
    });
});
