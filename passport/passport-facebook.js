//This page will hold the local lohin functionality
'use strict';
const passport=require("passport");
const User=require("../model/user");
const FacebookStrategy=require("passport-facebook").Strategy;
const secret=require('../secret/secretFile');

passport.serializeUser(function(user, done) {//serializeUser determines which of the users data will be saved in this session, here we save userID
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {//deserializeUser is used to retrive users data from the data base
    User.findById(id, function(err, user) {//findById method present in mongoose, if the user is found in databade then user data saved in user (object) anse added to error
      done(err, user);
    });
});

passport.use(new FacebookStrategy({
   
   clientID: secret.facebook.clientID,
   clientSecret: secret.facebook.clientSecret,
   profileFields:['email','displayName','photos'],
   callbackURL:'http://localhost:3000/auth/facebook/callback',
   passReqToCallback: true

  },(req, accesstoken, refreshToken, profile, done)=> {//token generates user token and profile stores users data if profile exist
    User.findOne({ facebook:profile.id }, (err, user)=> {//if the profile id of a particular user already exists
        if (err) { return done(err); }//This err contains the error caused due to network erroe or something else
        if (user) {
          return done(null, user);//if user data exist in database
        }
        else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbToken.push({token:accesstoken});
            
            newUser.save((err) => {
                return done(null, newUser);
            })
        }
    })
}));




