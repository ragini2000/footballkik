//setup===============================================================================================
const express = require('express');
const bodyParser=require("body-parser");//this allow us to get data from html forms
const ejs=require("ejs");//ejs is templating engine
const http=require("http");
const cookieParser=require("cookie-parser");
const expressValidator=require("express-validator");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const mongoose=require("mongoose");//Mongoose is object modeling for our MongoDB database.
const flash=require("connect-flash");//to display flash mesaages
const passport=require("passport");//Passport stuff will help us authenticating with different methods

const container=require("./container");

container.resolve(function(users, _){
    //configuration============================================================================================================
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik',{ useUnifiedTopology: true, useNewUrlParser: true}); //connect to our database  
    mongoose.set('useCreateIndex', true);
    const app =SetupExpress();
    
    function SetupExpress(){
        const app=express();
        const server=http.createServer(app);
        server.listen(3000,function(){
            console.log('Listening on port 3000')
        });
        ConfigureExpress(app);
        //setup router
        const router = require("express-promise-router")();
        users.SetRouting(router);
        app.use(router);
    }
    function ConfigureExpress(app){
        require("./passport/passport-local");//passport for configuration
        //setup express application
        app.use(express.static("public"));
        app.use(cookieParser());//read cookies (needed for auth)
        app.set("view engine","ejs");// set up ejs for templating
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(expressValidator());
        //required for passport
        app.use(session({
            secret: 'thisisasecretkey',//session secret
            resave: true,
            saveUninitialized: true,
            store:new MongoStore({mongooseConnection:mongoose.connection})
          }))
          app.use(flash());//use connect-flash for flash messages stored in session
          app.use(passport.initialize());
          app.use(passport.session());//persistent login session
          app.locals._=_;
    }
})

