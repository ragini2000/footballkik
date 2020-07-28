//using ES6 class to show the details of users logged in 
class Global {
    constructor(){
        this.globalRoom = [];//details of all the users
    }
    EnterRoom(id, name, room, img){//to add users details to globalRoom array
        var roomName = {id, name, room, img};//using ES6 object destructuring when we have key and value name same
        this.globalRoom.push(roomName);//pushing in globalRoom array
        return roomName;//return updated array 
    }

    GetRoomList(room){//display all users name connected to a room
        var roomName = this.globalRoom.filter((user) => user.room === room);//(ES6 method to loop and return) loop through the 
        //globalRoom array and if user.room matches with room passed store that users details in var user
        var namesArray = roomName.map((user) => {//(JS Method)javascript map function returns an array, returns the name of the users connected to same room
            return {
                name: user.name,
                img: user.img
            }
        });
        
        return namesArray;
    }
}
module.exports={Global};//exporting the class