//This page will hold the local lohin functionality
'use strict';
const passport=require("passport");
const User=require("../model/user");
const LocalStrategy=require("passport-local").Strategy;

passport.serializeUser(function(user, done) {//serializeUser determines which of the users data will be saved in this session, here we save userID
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {//deserializeUser is used to retrive users data from the data base
    User.findById(id, function(err, user) {//findById method present in mongoose, if the user is found in databade then user data saved in user (object) anse added to error
      done(err, user);
    });
});

passport.use("local.signup",new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true//all of the users data will be passed into the callback
  },(req, email, password, done)=> {
    User.findOne({ "email": email }, (err, user)=> {
        if (err) { return done(err); }//This err contains the error caused due to network erroe or something else
        if (user) {
          return done(null, false,req.flash("error","Email already exist"));//if user data exist in database
        }
          //Save this new user in database
          var newUser=new User();// we get data such as username,email etc from forms using the body-parser in server.js file
          newUser.username=req.body.username;
          newUser.email=req.body.email;
          newUser.password=newUser.encryptPassword(req.body.password);   
          
          newUser.save(err,function(){//to save the deatils provided in database
              done(null,newUser);
          });
    });
}));

passport.use("local.login",new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback:true//all of the users data will be passed into the callback
}, (req, email, password, done) =>{
  User.findOne({ "email": email }, (err, user) =>{
      if (err) { return done(err); }//This err contains the error caused due to network erroe or something else
      const messages=[];
      if (!user || !user.validUserPassword(password)) {
        messages.push('Email does not exist or password is invalid');
        return done(null, false,req.flash("error",messages));
      }
      return done(null,user);
  });
}));

