var express = require('express');
var router = express.Router();
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



module.exports = router;
