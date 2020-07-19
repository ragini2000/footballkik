//using ES6 class to show the details of users 
class Users {
    constructor(){
        this.users = [];//details of all the users
    }
    AddUserData(id, name, room){//to add users details to user array
        var users = {id, name, room};//using ES6 object destructuring when we have key and value name same
        this.users.push(users);//pushing in user array
        return users;//return updated array users
    }

    RemoveUser(id){//to remove user when the disconnect
        var user = this.GetUser(id);//user stores all the id contained in the array returned by GetUser function
        if(user){//if user array exist
            this.users = this.users.filter((user) => user.id !== id);//store the users whose userId is not equal the passed id that needs to be removed
        }
        return user;//updated user array returned after deleting the disconnected UserId
    }

    GetUser(id){//returns the socket id of all users connected to a particular channel
        var getUser = this.users.filter((userId) => {
            return userId.id === id;//returns the id that matches with the given id
        })[0];//to return the object present at index '0' of the new getUser array
        return getUser;
    }

    GetUsersList(room){//display all users name connected to a room
        var users = this.users.filter((user) => user.room === room);//(ES6 method to loop and return) loop through the 
        //users array and if user.room matches with room passed store that users details in var user
        var namesArray = users.map((user) => {//(JS Method)javascript map function returns an array, returns the name of the users connected to same room
            return user.name;//only return the name
        });
        
        return namesArray;
    }
}
module.exports={Users};//exporting the class