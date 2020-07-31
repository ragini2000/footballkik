module.exports=function(async, Club, Users){
    return {
        SetRouting: function(router){
            router.get('/results',this.getResults);
            router.post('/results',this.postResults);
            router.get('/members', this.viewMembers);
            router.post('/members', this.searchMembers);
        },

        getResults: function(req,res){//on going directly to result page you'll again land up on same homepage
            res.redirect('/home');
        },

        postResults: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.country), 'gi');//RegExp for matching text with the pattern, g flag for global search
                                                                    //i flag for ignore case 
                            //mongoDb or operator to seach for any of the value specified in the object
                    Club.find({'$or': [{'country':regex}, {'name': regex}]}, (err, result) => {//searching either by name or country
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                //console.log(dataChunk);
                res.render('results', {title: 'Footballkik - Results', user: req.user, chunks: dataChunk});
            })
        },

        viewMembers: function(req, res){
            async.parallel([
                function(callback){
                    Users.find({}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                //console.log(dataChunk);
                res.render('members', {title: 'Footballkik - Members', user: req.user, chunks: dataChunk});
            })
        },

        searchMembers: function(req, res){//for member page
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.username), 'gi');//search for username globally ignoring cases
                    
                    Users.find({'username': regex}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('members', {title: 'Footballkik - Members', user: req.user, chunks: dataChunk});
            })
        }
    }
}