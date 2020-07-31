module.exports=function(async, Club, _, Users, Message){
    return{
        SetRouting: function(router){
            router.get("/home",this.homePage);  
            router.post("/home",this.postHomePage);
            router.get("/logout",this.logout);
        },
        homePage: function(req,res){
            async.parallel([//async.parallel method to run multiple asynchronous operations in parallel.
                function(callback){
                    Club.find({}, (err, result) => {//mongoose find method returns an array, we use empty {} as first argument because we want to retrieve all the data from the users database
                        callback(err, result);
                    })
                },
                function(callback){
                    Club.aggregate([{// mongoose aggregate method to group data by country
                        $group: {
                            _id: "$country"
                        }
                    }], (err, newResult) => {
                       callback(err, newResult) ;
                    });
                },
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
                const res1=results[0];//result of find method in function 1
                const res2=results[1];//result of aggregate method in function 2
                const res3=results[2];
                const res4=results[3];

                //console.log(res2);//to check data
                const dataChunk=[];//to have 3 boxes in a row
                const chunkSize=3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));//slice method to divide the res1 array i.e data1 to data4 goes into dataChunk
                }
                //console.log(dataChunk);
                const countrySort=_.sortBy(res2,"_id");//lodash sortby method to sort the countries i.e res2 under filter tag, since _id is string, res2 is sorted alphabetically
                res.render('home',{title:'footballkik-home',chunks:dataChunk, user:req.user, country:countrySort, data:res3, chat:res4});
            })
        },
        postHomePage: function(req,res){
            async.parallel([
                function(callback){//update the club document inside the club collection when a user adds any club as favourite
                    Club.update({
                        '_id':req.body.id,//we search in the club collection the _id 
                        'fans.username':{$ne:req.user.username}//to check if the user diesnt already exists in the fans object array
                    },{
                        $push : {fans: {//to push the data inside the fans object array
                            username:req.user.username,
                            email:req.user.email
                        }}
                    },(err,count)=>{
                        //console.log(count);
                        callback(err,count);
                    });
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
                res.redirect('/home');
            });
        },
    logout: function(req,res){//destroy the user session when the user clicks the logout button and will be redirected to the index page
        req.logout();//logout method
        req.session.destroy((err)=>{//destroy the session
            res.redirect('/');//redirect to index page
        });
    }
    }
}