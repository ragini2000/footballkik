//This is clent side file--holds jQuery code that will allow us to send data to server and also display data on the browser
$(document).ready(function(){
    var socket=io();//connects to the host that serves this page
    socket.on("connect",function(){//to list to connection event
        console.log("Yeah! User connected");//this will be displayed in the browser
    });
    socket.on('newMessage',function(data){//to listen to the event coming from server side, "data" stores the data that comes along with event 
        console.log(data);//displayed in the browser
    });
    $('#message-form').on('submit',function(e){//to add jQuery submit event to the form with id: message-form
        e.preventDefault();//we dont't want the form to reload once it is submitted
        var msg=$('#msg').val();//to get data from the input field
        socket.emit('createMessage',{//to emit "create message" event on the server side
            text: msg // text is the object that will contain the data
        });
    });

});