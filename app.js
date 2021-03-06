var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
//here are the routes
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api')

//put momgoDB running by caling this:
//"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath C:\Users\Miska\Koulujuttuja\Ohsiha\sulisApp\data\db

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use("/images",express.static(__dirname + "/public/images/"));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
/*
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
*/
//app.use(passport.initialize());
//app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));

// passport config
var User = require('./models/user');
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());


//connect to dapabase
//mongodb://127.0.0.1:27017
mongoose.connect('mongodb://localhost:27017/sulkapalloDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// app need to use these routes
app.use('/', index);
app.use('/users', users);
app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
