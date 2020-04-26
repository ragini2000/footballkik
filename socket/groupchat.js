//Server Side File--this will hold all the server code for group chat
module.exports=function(io){
    io.on("connection",function(socket){
        console.log("User connected");
    });                          //listen for connection event of the user
}