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

    RemoveUser(id){//to remove user when the disconnect
        var user = this.GetUser(id);//user stores all the id contained in the array returned by GetUser function
        if(user){//if user array exist
            this.users = this.globalRoom.filter((user) => user.id !== id);//store the users whose userId is not equal the passed id that needs to be removed
        }
        return user;//updated user array returned after deleting the disconnected UserId
    }

    GetUser(id){//returns the socket id of all users connected to a particular channel
        var getUser = this.globalRoom.filter((userId) => {
            return userId.id === id;//returns the id that matches with the given id
        })[0];//to return the object present at index '0' of the new getUser array
        return getUser;
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