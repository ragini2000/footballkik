module.exports=function(Users, async){
    return{
        SetRouting: function(router){
        router.get("/group/:name",this.groupPage);
        router.post('/group/:name', this.groupPostPage);
        },

        groupPage: function(req,res){
            const name=req.params.name;
            res.render("groupchat/group",{title:"Footballkik-group", user:req.user, groupName:name});
        },

        groupPostPage: function(req, res){
            async.parallel([//we want to perform function 1 and function 2 parallely
                function(callback){//function 1: to update receivers document
                    if(req.body.receiverName){//if receiverName exists
                        Users.update({//Users collection for the receiver is updated
                           'username': req.body.receiverName,//get the sender's username
                           'request.userID':{$ne: req.user._id}, //to check the user_id doesnt already exists, i.e sender is not already
                            //present in friend's list using mongoDB not equal operator $ne
                            'friendsList.friendID':{$ne: req.user._id}//to check sender is not already present in DB
                        },//else
                        {
                            $push:{request:{//mongoDB push operator to store the detail of the sender in the request object, refer model/user
                                userID:req.user._id,
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
                             'friendsList.friendID':{$ne: req.user._id}//to check sender is not already present in DB
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
        }

    }
}