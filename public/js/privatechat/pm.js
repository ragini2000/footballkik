//client side
$(document).ready(function(){
    var socket=io();
    var paramOne= $.deparam(window.location.pathname);//value returned from deparam.js//paramOne acts as room 1
    //console.log(paramOne);
    var newParam= paramOne.split('.');//split at .
    //console.log('1',newParam);
    swap(newParam,0,1);//swapping value at index1 with value at index2 in newParam array
    //console.log('2',newParam);
    var paramTwo= newParam[0]+'.'+newParam[1];//paramTwo acts as room 2

    socket.on('connect',function(){//listen for the connect event
        var params={//we created an object params
            room1:paramOne,
            room2:paramTwo
        }
        socket.emit('join PM', params);//emitting the params object
    });

    $('#message_form').on('submit',function(e){//to add jQuery submit event to the form with id: message_form
        e.preventDefault();//we dont't want the form to reload once it is submitted

        var msg=$('#msg').val();//to get data from the input field
        var sender=$('#name-user').val();//from privatechat.ejs line 23
        
        if(msg.trim().length > 0){//trim method to remove white spaces if this is true then we will emit the object
            socket.emit('private message',{//to emit "private message" event on the server side
            text: msg, // text is the object that will contain the data
            sender: sender
        })
    }    
    });
});
function swap(input, value_1, value_2){//for swapping the values stored in newParam
    var temp= input[value_1];          //we want to have senders name at first position
    input[value_1]= input[value_2];    //to have receiver's name at second position
    input[value_2]= temp;
}