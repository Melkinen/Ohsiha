var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var discGolfLane = require('../models/discGolfLane.js');
var userQueries = require('../dataBaseQueries/userQueries')
var matchQueries = require('../dataBaseQueries/matchQueries')
const helpingFunctions = require("../javascriptFunctions/helpingFunctions")



router.post('/user', function(req, res, next) {
  userQueries.createNewUSer(req,res,next);
});
router.get('/user', function(req, res, next) {
  userQueries.getAllUsers(req,res,next);
});
router.get('/user/:userID', function(req, res, next) {
  var userID = req.params.userID;
  req.params.userID = userID;
  userQueries.apiGetOneUserInformation(req,res,next);
});
router.get('/word', function(req, res, next) {
  helpingFunctions.getOneRandomWord(req,res,next);
});
router.get('/match', function(req, res, next) {
  matchQueries.getAllMatches(req,res,next);
});



router.get('/lane', function(req, res, next) {
  find("discGolfLane",{},function(err, matches) {
    console.log(matches);
    res.send(matches);
  });
  return;
});
function find (collec, query, callback) {
mongoose.connection.db.collection(collec, function (err, collection) {
collection.find(query).toArray(callback);
});
}
router.get('/lane/:laneName', function(req, res, next) {
  console.log(req.params.laneName)
  find("discGolfLane",{name: req.params.laneName},function(err, data) {
    res.send(data);
  });
  return;
});


router.get('/lane/:nameOfLane', function(req, res, next) {
  find("discGolfLane",{name: req.params.nameOfLane},function(err, matches) {
    console.log(matches);
    res.send(matches);
  });
  return;
});

router.get('/news', function(req, res, next) {
  var http = require('http');
  var options = {
  host: 'www.mtv.fi',
  path: '/api/feed/rss/uutiset_uusimmat'
};
var req = http.get(options, function(res) {
console.log('STATUS: ' + res.statusCode);
console.log('HEADERS: ' + JSON.stringify(res.headers));

// Buffer the body entirely for processing as a whole.
var bodyChunks = [];
res.on('data', function(chunk) {
  // You can process streamed parts here...
  bodyChunks.push(chunk);
}).on('end', function() {
  var body = Buffer.concat(bodyChunks);
  //console.log('BODY: ' + body);
  //res.send(body);
  // ...and/or process the entire body here.
})
});
});




module.exports = router;
