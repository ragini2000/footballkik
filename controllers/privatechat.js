module.exports= function(async, Users){
    return{
        SetRouting: function(router){
            router.get('/chat/:name', this.getchatPage);
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
        }
    }
}
