const { Router } = require("express")

module.exports=function(){
    return {
        SetRouting: function(router){
            router.get('/results',this.getResults);
        },
        getResults: function(req,res){
            res.render('results',{user:req.user});
        }
    }
}