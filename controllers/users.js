"use strict";
module.exports = function (_,passport,User){
    return {
        SetRouting: function (router){
            router.get("/",this.indexPage);
            router.get("/signup",this.getSignup);
            router.get("/home",this.homePage);
            router.post("/signup",User.SignUpvalidation,this.postSignup);
            

        },
        indexPage: function (req, res){
            return res.render("index");
        },
        getSignup:function(req,res){
            const errors=req.flash("error");
            return res.render("signup",{title:'MyChatApp | SignUp', messages: errors, hasErrors:errors.length>0});// if error.length greater than zero that hasErrors is set to true that will allow bootstrap alert to be displayed 
        },
        homePage: function(req,res){
            return res.render('home');
        },
        postSignup:passport.authenticate('local.signup', { 
                successRedirect: '/home',//if registration is succesful that take the user to this page
                failureRedirect: '/signup',//if not successful, than back to signup page
                failureFlash: true // able to show flash messages
        }),
        
    }
}