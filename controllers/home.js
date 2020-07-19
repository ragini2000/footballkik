module.exports=function(async, Club, _){
    return{
        SetRouting: function(router){
            router.get("/home",this.homePage);    
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
                }
            ],(err,results)=>{
                const res1=results[0];//result of find method in function 1
                const res2=results[1];//result of aggregate method in function 2
                //console.log(res2);//to check data
                const dataChunk=[];//to have 3 boxes in a row
                const chunkSize=3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));//slice method to divide the res1 array i.e data1 to data4 goes into dataChunk
                }
                //console.log(dataChunk);
                const countrySort=_.sortBy(res2,"_id");//lodash sortby method to sort the countries i.e res2 under filter tag, since _id is string, res2 is sorted alphabetically
                res.render('home',{title:'footballkik-home',data:dataChunk, user:req.user, country:countrySort});
            })
        }
    }
}