const express = require('express');
const bodyParser=require("body-parser");//this allow us to get data from html forms
const ejs=require("ejs");
const http=require("http");
const cookieParser=require("cookie-parser");
const expressValidator=require("express-validator");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const mongoose=require("mongoose");
const flash=require("connect-flash");//to display flash mesaages
const passport=require("passport");

const container=require("./container");

container.resolve(function(users, _){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik',{ useUnifiedTopology: true, useNewUrlParser: true});    
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
        require("./passport/passport-local");
        app.use(express.static("public"));
        app.use(cookieParser());
        app.set("view engine","ejs");
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(expressValidator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store:new MongoStore({mongooseConnection:mongoose.connection})
          }))
          app.use(flash());
          app.use(passport.initialize());
          app.use(passport.session());
          app.locals._=_;
    }
})

