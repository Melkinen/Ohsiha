var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var jwt  = require('jwt-simple');
var config  = require('../config/database.js'); // get db config file
var User = require('../models/user.js');
var Match = require('../models/match.js');
var userQueries = require('../dataBaseQueries/userQueries')
var matchQueries = require('../dataBaseQueries/matchQueries')
var passport  = require('passport');
var helpingFunctions = require('../javascriptFunctions/helpingFunctions')
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
require('../config/passport')(passport)

/* GET home page. */

router.get('/', function(req, res, next) {
  console.log('called /');
  res.render('index', {user:req.user, title: 'Frisbeegolffi aplikaatio' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Rekisteröityminen' });
});
router.post('/register', function(req, res) {

  if (!req.body.name || !req.body.password) {
  res.json({success: false, msg: 'Please pass name and password.'});
} else {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    created_at: getDateNow()
  });
  // save the user
  newUser.save(function(err) {
    if (err) {
      console.log(err);
      return res.json({success: false, msg: 'Username already exists.'});
    }
    res.json({success: true, msg: 'Successful created new user.'});
  });
}
});

router.get('/mainPage',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  res.render('mainPage', {user: req.user, title: 'MainPage' });
});

router.get('/match',passport.authenticate('jwt', { session: false}), function(req,res,next){
  res.render('newMatch', {user: req.user, title: 'Match recording' });
});

function getDateNow (){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  var returnDay = mm+'-'+dd+'-'+yyyy;
  return returnDay;
};

router.post('/match', passport.authenticate('jwt', { session: false}), function(req,res,next){
    var today = getDateNow();
    var username =  req.cookies['username'];
    var newMatch =  new Match({
      name: req.body.description,
      player1: username,
      player2: req.body.opponentID,
      player1Points: req.body.Ownpoints,
      player2Points: req.body.opponentspoints,
      location: req.body.location,
      created_at: today,
      updated_at: today
    });
    console.log("newMAtch "+ newMatch);
      Match.create(newMatch, function (err) {
        console.log(err);
  });
    res.send("Success")
});

router.get('/ownInformation', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = req.cookies['token'];
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

          res.render('userInformation', { "username":user.username,"name":user.name,"age":user.meta.age,"hometown":user.hometown});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


router.put('/ownInformation',passport.authenticate('jwt', { session: false}), function(req,res,next){
    console.log("put called")
    var token = req.cookies["token"];
    userQueries.changeUserInformation(req,res,next,token);
});

router.get('/matchHistory', passport.authenticate('jwt', { session: false}), function(req, res, next){
  //here query the matches from DB that has the userID
  var token = req.cookies['token'];
  if (token) {
  user = userQueries.getOneUsersMatchesBYToken(req,res,next,token);
  }
  else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.cookie("token", token);
          res.cookie("username", user.username);
          res.render('mainPage', {success: true, token: 'JWT ' + token, username :req.body.username});

        } else {
          //res.redirect('/mainPage?userID='+req.user.id);

          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


router.get('/deleteMatchHistory/:ID',passport.authenticate('jwt', { session: false}) , function(req, res, next) {
  res.render('deleteMatch', { title: 'Match deletion' });
});

router.delete('/match/:id', passport.authenticate('jwt', { session: false}),function(req, res, next) {
  console.log(req.params.id);
  Match.find({ _id:req.params.id }).remove().exec();
  res.send("match removed ")


});
router.get('/matches',passport.authenticate('jwt', { session: false})  ,function(req, res,next) {
    res.render("allMatches");
});

router.get('/logout',  function(req, res) {
    res.clearCookie("token");
    res.redirect('/');
});

router.post('/image', function(req, res) {
    console.log("called add image")
});

router.get('/lane',  function(req, res) {

    res.render("allLanes");
});

router.get('/lane/:laneName',  function(req, res) {
    req.params.laneName
    res.render("laneInfo");
});

/*
router.get("/scraper",function(req,res){

  url = 'http://frisbeegolfradat.fi/radat/tampere/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var links =[];

    $('.rataCol').each(function(i, elem) {
         links[i] = $(elem).find("a").attr("href");
      });

      //here are the links to each page that contains one track
      fs.writeFileSync("./linksTampere.txt",links);


    };

    res.json(links);
  })
});

var ALLLANES1

router.get("/scrapeLines",function(req,res){

  var links = fs.readFileSync("./links.txt","utf-8");
  var links = links.split(",");
  var allLanes = [];
  scrapeOneLink(links, 0);



});


function scrapeOneLink(links, index){
  if (index >= links.length){
    console.log("lopeta rekursio" + index);
    return;
  }
  console.log("Index: " + index);

  request(links[index], function(error, response, html){
    //console.log("started this")

    //console.log(html);
    var $ = cheerio.load(html);
    //all the information that we need to make one trak object
    //console.log($);
    //console.log("this stuff" + $);
    var vaylat = [];
    var rataNimi = "radanNimi";
    var vaylienMaara = 0;
    var radanKuvaus = "ei kuvausta";
    var pinnanMuodot = "ei kuvausta";
    var osoite = "osoite"
    //update the data if it is found
    rataNimi = $(".course-heading").find("h1").text();
    console.log("ratanimi; "+ rataNimi );

    vaylienMaara = $(".course_info_left").eq(2).find("p").text();
    radanKuvaus = $(".caption").find("p").text();
    pinnanMuodot = $(".course_info_left").eq(3).find("p").text();
    osoite =  $(".course_info_left").eq(0).find("p").text();
    //console.log($);
    //console.log(vaylienMaara);
    //console.log("goin to vauyla")
    $('.fairway').each(function(i, elem) {
         vaylat[i] = $(elem).find("p").eq(0).text();
         //console.log("vaylat:    " + vaylat[i]);
      });

    for (vayla in vaylat){
        splittedVaylat = vaylat[vayla].split(" ");
        ///(\r\n|\" ")/gm
        var distance = splittedVaylat[1];
        var par = splittedVaylat[4];
        var vaylaObjekti = {};
        vaylaObjekti.distance = distance;
        vaylaObjekti.par = par;
        vaylat[vayla] = vaylaObjekti;
    }
    //create the json object for one track

    var rataObjekti = {};
    rataObjekti.name = rataNimi;
    rataObjekti.numberOfLanes = vaylienMaara;
    rataObjekti.description = radanKuvaus.replace(/(\r\n|\n|\r|\t)/gm," ");
    rataObjekti.topography = pinnanMuodot;
    rataObjekti.lanes = vaylat;
    rataObjekti.place = osoite.trim();
    //console.log("rataobjecti: " +  JSON.stringify(rataObjekti));

    //console.log("all lanes!!!!!!!!!!!!!!!!:   "+  JSON.stringify(allLanes));
    console.log("writing to file")
    fs.appendFileSync("./allLines.txt", JSON.stringify(rataObjekti) + ",");
    index = index + 1;
    scrapeOneLink(links, index);

  });
}
*/
module.exports = router;
