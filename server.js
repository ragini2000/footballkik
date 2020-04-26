//setup===============================================================================================
const express = require('express');//we only require this module once in this file only
const bodyParser=require("body-parser");//this allow us to get data from html forms
const ejs=require("ejs");//ejs is templating engine
const http=require("http");
const cookieParser=require("cookie-parser");
const expressValidator=require("express-validator");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const mongoose=require("mongoose");//Mongoose is object modeling for our MongoDB database.
const flash=require("connect-flash");//to display flash mesaages
const passport=require("passport");//Passport stuff will help us authenticating with different method, it is an authentication middleware
const socketIO=require("socket.io");
const container=require("./container");

container.resolve(function(users, _, admin, home, group){//every route that we will use is passed as arguments in this function
    //configuration============================================================================================================
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik',{ useUnifiedTopology: true, useNewUrlParser: true}); //connect to our database  
    mongoose.set('useCreateIndex', true);
    const app =SetupExpress();
    
    function SetupExpress(){
        const app=express();
        const server=http.createServer(app);//created server connection
        const io=socketIO(server);//added socketIO configuration
        server.listen(3000,function(){
            console.log('Listening on port 3000');
        });
        ConfigureExpress(app);
        //setup router
        require("./socket/groupchat")(io);
        const router = require("express-promise-router")();//this allows middleware to return promises
        users.SetRouting(router);//users.js in controller folder, here we will set router.post, router.get, setRouting will be a function in users.js file that will hold all the routes
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        app.use(router);
        
    }
    function ConfigureExpress(app){//it contains middlewares
        require("./passport/passport-local");//passport local for configuration
        require("./passport/passport-facebook");//passport fb for configuration
        require("./passport/passport-google");//passport google for configuration
        //setup express application
        app.use(express.static("public"));// express will be able to render or make use of all the static files created in public folder
        app.use(cookieParser());//read cookies (needed for auth)
        app.set("view engine","ejs");// set up ejs for templating, here ejs is the view engine
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(expressValidator());// this app.use is express middleware
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
          app.locals._=_;//registered lodash as a local variable
    }
})

