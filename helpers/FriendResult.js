//This function can be called by any file in the controller in order to perform the function of saving PM in notification in navbar
//of any page-home or group or privatechat

module.exports = function(async, Users, Message){
    return {
        PostRequest: function(req,res,url){
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
                res.redirect(url);
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
                },

                //this function is to update the data of receiver on canceling friend request
                function(callback){
                    if(req.body.user_Id){//senderId present, refer navbar.ejs- request dropdown section
                        Users.update({
                            '_id':req.user._id,//to check if collection consists the senderId of the logged in user (receiver)
                            'request.userId': {$eq: req.body.user_Id}//to check if the sender's ID already exists in the friendList
                        },{
                            $pull: {request: {// to pull out/remove the data from the request object array
                                userId:req.body.user_Id//remove userId of sender
                            }},
                            $inc: {totalRequest: -1}//decrement totalRequest by 1
                        },(err,count)=>{
                            callback(err,count);
                        });
                    }
                },

                //this function is to update the data of the sender on cancelling of friend request by receiver
                function(callback){
                    if(req.body.user_Id){//senderId present, refer navbar.ejs- request dropdown section
                        Users.update({
                            '_id':req.body.user_Id,//to check if collection consists the senderId of the logged in user
                            'sentRequest.username': {$eq: req.user.username}//to check if the sender's ID already exists in the friendList
                        },{
                            $pull: {sentRequest: {// to pull out/remove the data from the sentRequest object array
                                username:req.user.username //remove username of receiver
                            }}
                        },(err,count)=>{
                            callback(err,count);
                        });
                    }
                },
                function(callback){
                    if(req.body.chatId){
                        Message.update({
                            '_id': req.body.chatId
                        },
                        {
                            "isRead": true//to mark the msg read in DB
                        },(err,done)=>{
                            console.log(done)
                            callback(err,done);
                        })
                    }
                }
                
            ],(err,results)=>{
                res.redirect(url);   
            });
        }
    }
}