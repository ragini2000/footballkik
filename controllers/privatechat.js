module.exports= function(async, Users, Message){
    return{
        SetRouting: function(router){
            router.get('/chat/:name', this.getchatPage);
            router.post('/chat/:name', this.chatPostPage);
        },
        getchatPage: function(req,res){
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
                res.render('private/privatechat',{title:'Footballkik- Private Chat', user:req.user, data: result1});
            });    
        },

        chatPostPage: function(req,res,next){
            const params=req.params.name.split('.');//returns an array
            const nameParams=params[0];//receiver's name at index 0

            //to search through the database for nameParams by ignoring case
            const nameRegex=new RegExp("^"+nameParams.toLowerCase(),"i");//to ignore case i flag- to convert everything in nameParams to lowercase
        
            async.waterfall([//waterfall is used to use result of one function in next function
                function(callback){//function 1: fetches data of receiver
                    if(req.body.message){//if we have message in the input field
                        Users.findOne({'username':{$regex: nameRegex}},(err,data)=>{//findOne returns data of the receiver from DB
                            callback(err,data);
                        });
                    }
                },
                //function 2: to push the message info into database
                function(data,callback){//result of previous function used in this function
                    if(req.body.message){
                        const newMessage=new Message();
                        newMessage.sender=req.user._id;//user is sending the message
                        newMessage.receiver=data._id;//receiver's data
                        newMessage.senderName=req.user.username;//user sending the message is logged in
                        newMessage.receiverName=data.username;
                        newMessage.message=req.body.message;
                        newMessage.userImage=req.user.UserImage;
                        newMessage.createAt=new Date();

                        newMessage.save((err,result)=>{
                            if(err){
                                return next(err);
                            }
                            //console.log(result);
                            callback(err,result);
                        })
                    }
                }
            ],(err,results)=>{
                res.redirect('/chat/'+req.params.name);
            })
        }
    }
}
