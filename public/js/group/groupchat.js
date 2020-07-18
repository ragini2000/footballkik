//This is clent side file--holds jQuery code that will allow us to send data to server and also display data on the browser
$(document).ready(function(){
    var socket=io();//connects to the host that serves this page
    var room=$('#groupName').val();//room contains the value present in id groupNmae of public/js/group/groupchat.js
    var sender=$('#sender').val();//sender contains the value present in id sender of public/js/group/groupchat.js
    socket.on("connect",function(){//to list to connection event
        console.log("Yeah! User connected");//this will be displayed in the browser
        var params={
            room: room
        }
        socket.emit('join',params,function(){//emit the join event
            console.log("User has joined this channel");    
        });
    });
    
    socket.on('newMessage',function(data){//to listen to the event coming from server side, "data" stores the data that comes along with event 
        console.log(data);//displayed in the browser
    });
    
    $('#message-form').on('submit',function(e){//to add jQuery submit event to the form with id: message-form
        e.preventDefault();//we dont't want the form to reload once it is submitted
        var msg=$('#msg').val();//to get data from the input field
        socket.emit('createMessage',{//to emit "create message" event on the server side
            text: msg, // text is the object that will contain the data
            room: room,
            sender: sender
        },function(){
            $('#msg').val('');//once the user clicks send, the input field is cleared
        });
    });

});