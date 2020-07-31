const { result } = require("lodash");

module.exports=function(Users, async, Message, FriendResult){
    return{
        SetRouting: function(router){
        router.get("/group/:name",this.groupPage);
        router.post('/group/:name', this.groupPostPage);
        router.get("/logout",this.logout);
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
                },
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{"_id":{
                            "last_message_between":{
                                $cond:[
                                    {
                                        $gt:[
                                        {$substr:["$senderName",0,1]},
                                        {$substr:["$receiverName",0,1]}]
                                    },
                                    {$concat:["$senderName"," and ","$receiverName"]},
                                    {$concat:["$receiverName"," and ","$senderName"]}
                                ]
                            }
                            }, "body": {$first:"$$ROOT"}
                            }
                        }], function(err, newResult){
                            //console.log(newResult);
                            callback(err,newResult);
                        }
                    )
                }
            ],(err,results)=>{
                const result1 = results[0];
                const result2 = results[1];

                //console.log(result1.request[0].userId);//prints all the details of the person who sent the request
                res.render("groupchat/group",{title:"Footballkik-group", user:req.user, groupName:name, data: result1, chat:result2});
            });
            
        },

        groupPostPage: function(req, res){
            FriendResult.PostRequest(req, res,'/group/'+req.params.name);    
        },

        logout: function(req,res){//destroy the user session when the user clicks the logout button and will be redirected to the index page
            req.logout();//logout method
            req.session.destroy((err)=>{//destroy the session
                res.redirect('/');//redirect to index page
            });
        }
    }
}