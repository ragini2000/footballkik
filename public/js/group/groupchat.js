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
    var template=$('#message-template').html();//we have the message template coming from view/groupchat/group.ejs that any member types
    var message=Mustache.render(template,{//the second parameter of render method is object that contains the data coming from socket/groupchat.js io.to
        text: data.text, // the key text contains the message
        sender:data.from//the key from contains sender
    });
    $('#messages').append(message);//the message rendered from the view is appended to the element with messages id in view
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