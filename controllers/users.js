"use strict";
module.exports = function (_,passport,User){
    return {
        SetRouting: function (router){
            router.get("/",this.indexPage);
            router.get("/signup",this.getSignup);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get("/home",this.homePage);
            router.post("/",User.LoginValidation,this.postLogin);
            router.post("/signup",User.SignUpvalidation,this.postSignup);
            

        },
        indexPage: function (req, res){
            const errors=req.flash("error");
            return res.render("index",{title:'Login', messages: errors, hasErrors:errors.length>0});
        },
        postLogin:passport.authenticate('local.login', { 
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true 
        }),
        getSignup:function(req,res){
            const errors=req.flash("error");
            return res.render("signup",{title:'SignUp', messages: errors, hasErrors:errors.length>0});// if error.length greater than zero that hasErrors is set to true that will allow bootstrap alert to be displayed 
        },
        homePage: function(req,res){
            return res.render('home');
        },
        postSignup:passport.authenticate('local.signup', { 
                successRedirect: '/home',//if registration is succesful that take the user to this page
                failureRedirect: '/signup',//if not successful, than back to signup page
                failureFlash: true // able to show flash messages
        }),
        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email' 
         }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        })
        
    }
}