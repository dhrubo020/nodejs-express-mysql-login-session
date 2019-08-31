/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '',
              database : 'info'
            });
 
connection.connect();
 
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 3600000*24*90 }
            }))
 
// development only
 
app.get('/', user.profile);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.get('/login', routes.index);//call for login page
app.get('/passwordRecovery', user.passwordRecovery);
app.get('/reset',user.reset);

app.post('/signup', user.signup);//call for signup post 
app.post('/login', user.login);//call for login post
app.post('/reset',user.reset);
app.post('/passwordRecovery', user.passwordRecovery);

app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
//Middleware
app.listen(8080)
