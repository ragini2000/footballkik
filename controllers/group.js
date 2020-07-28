const { result } = require("lodash");

module.exports=function(Users, async){
    return{
        SetRouting: function(router){
        router.get("/group/:name",this.groupPage);
        router.post('/group/:name', this.groupPostPage);
        },

        groupPage: function(req,res){
            const name=req.params.name;

            async.parallel([//to get the data of every logged in users
                function(callback){
                    Users.findOne({'username': req.user.username})//mongoose method to find data with same username
                        .populate('request.userId')//populate method used as chaining to add the userId object into request object array
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ],(err,results)=>{
                const result1 = results[0];
                //console.log(result1.request[0].userId);//prints all the details of the person who sent the request
                res.render("groupchat/group",{title:"Footballkik-group", user:req.user, groupName:name, data: result1});
            });
            
        },

        groupPostPage: function(req, res){
            async.parallel([//we want to perform function 1 and function 2 parallely
                function(callback){//function 1: to update receivers document
                    if(req.body.receiverName){//if receiverName exists
                        Users.update({//Users collection for the receiver is updated
                           'username': req.body.receiverName,//get the sender's username
                           'request.userId':{$ne: req.user._id}, //to check the user_id doesnt already exists, i.e sender is not already
                            //present in friend's list using mongoDB not equal operator $ne
                            'friendsList.friendId':{$ne: req.user._id}//to check sender is not already present in DB
                        },//else
                        {
                            $push:{request:{//mongoDB push operator to store the detail of the sender in the request object, refer model/user
                                userId:req.user._id,
                                username:req.user.username
                            }},
                            $inc: {totalRequest:1}// mongoDB inc operator to increment totalRequest field of receiver
                        },(err,count)=>{
                            callback(err,count);
                        })                                     
                    }
                },

                function(callback){//function 2: to update senders document
                    if(req.body.receiverName){
                        Users.update({//Users collection for the receiver is updated
                            'username': req.user.username,//get the receiver's username
                            'sentRequest.username':{$ne: req.body.receiverName}, //to check if friend request already sent earlier to this receiver
                             'friendsList.friendId':{$ne: req.user._id}//to check sender is not already present in DB
                         },
                         {
                            $push:{sentRequest:{//to push receivers data into sentRequest field of model/user
                                username: req.body.receiverName    
                            }}
                         },(err,count)=>{
                             callback(err,count);
                         })
                    }
                }
            ],(err,results)=>{//results stores the updated fields from the above function
                res.redirect('/group/'+req.params.name);
            });

            async.parallel([// to accept the friend request
            //this function is to update the data of the receiver of the friend request when it is accepted
                function(callback){//to update friendList object array for receiver in case request accepted
                    if(req.body.senderId){//senderId present, refer navbar.ejs- request dropdown section
                        Users.update({
                            '_id':req.user._id,//to check if collection consists the _id of the logged in user
                            'friendsList.friendId': {$ne: req.body.senderId}//to check if the sender's ID not already exists in the friendList
                        },{
                            $push: {friendsList: {
                                friendId:req.body.senderId,//whatever is coming from the view inside the senderId element will be pushed 
                                friendName:req.body.senderName//inside the friendId of friendList object array
                            }},
                            $pull: {request: {// to pull out/remove the data from the request object array
                                userId:req.body.senderId,
                                username:req.body.senderName
                            }},
                            $inc: {totalRequest: -1}//decreasing the totalRequest
                        },(err,count)=>{
                            callback(err,count);
                        });
                    }
                },
                //this function is to update the data of the sender of the friend request when it is accepted by the receiver
                function(callback){
                    if(req.body.senderId){//senderId present, refer navbar.ejs- request dropdown section
                        Users.update({
                            '_id':req.body.senderId,//to check if collection consists the senderId of the logged in user
                            'friendsList.friendId': {$ne: req.user._id}//to check if the receiver's ID not already exists in the friendList
                        },{
                            $push: {friendsList: {
                                friendId:req.user._id,//whatever is coming from the view inside the senderId element will be pushed 
                                friendName:req.user.username//inside the friendId of friendList object array
                            }},
                            $pull: {sentRequest: {// to pull out/remove the data from the sentRequest object array
                                username:req.user.username
                            }},
                        },(err,count)=>{
                            callback(err,count);
                        });
                    }
                }
            ],(err,results)=>{
                res.redirect('/group/'+req.params.name);   
            });
        }
    }
}