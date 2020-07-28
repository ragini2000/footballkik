//client side file to hold friend requests files
$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val();//room contains the value present in id groupNmae of public/js/group/groupchat.js
    var sender = $('#sender').val();//room contains the value present in id sender of public/js/group/groupchat.js

    socket.on('connect', function(){//whenever a users connects
        var params = {
            sender: sender
        }
        
        socket.emit('joinRequest', params, function(){//emit event when user joins, event name- joinRequest, emitted event in the cliet
            console.log('Joined');                  //side, go to the server side to listen the event
        });
    });

    socket.on('newFriendRequest', function(friend){
        //console.log(friend);
        //notification for the user to automatically know when a new friend request comes in
        $('#reload').load(location.href + ' #reload');//load methods loads data from the server and returns the data to the element
        
        $(document).on('click', '#accept_friend', function(){//to accept the friend request
            var senderId = $('#senderId').val();//from navbar.ejs
            var senderName = $('#senderName').val();

            $.ajax({//to save in the database
                url: '/group/'+room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove();//to remove every element of that sender from the request dropdown
                }
            });
            $('#reload').load(location.href + ' #reload');
        });

        $(document).on('click', '#cancel_friend', function(){//to accept the friend request
            var user_Id = $('#user_Id').val();//from partial/navbar.ejs

            $.ajax({//to save in the database
                url: '/group/'+room,
                type: 'POST',
                data: {
                    user_Id: user_Id
                },
                success: function(){
                    $(this).parent().eq(1).remove();//to remove every element of that sender from the request dropdown
                }
            });
            $('#reload').load(location.href + ' #reload');
        });
    });

    $('#add_friend').on('submit', function(e){//on clicking submit button, i.e add_friend id form in group.ejs file
        e.preventDefault();//to prevent the page from reloading/refreshing
        
        var receiverName = $('#receiverName').val();//receiverName from value entered at this id in group.ejs file

        $.ajax({//send the data using the AJAX method to the database and after sending we need to emit another new event, which after
            //we go to the friend.js file to listen for that event
            url: '/group/' + room,
            type: 'POST',//posting data to the database
            data: {//data that we want to send
                receiverName: receiverName//on clicking the name of the user we are dynamically adding the name of the receiver refer groupchat.js line 27
            },
            success: function () {//when data successfully pushed into the database
                socket.emit('friendRequest', {//we need to emit new friendRequest event, it contains objects-sender name and receiver name
                    receiver: receiverName,// this event is to show real time notification as soon as the request is sent and details is added to the DB
                    sender: sender
                }, function () {//acknowledgement added
                    console.log('Request Sent');//to displayed in browser console
                })
            }
        })
    });

    $('#accept_friend').on('click', function(){
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });

    $('#cancel_friend').on('click', function(){//to cancel friend request i.e not accept
        var user_Id = $('#user_Id').val();//from partial/navbar.ejs

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });
});

