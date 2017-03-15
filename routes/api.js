var express = require('express');
var router = express.Router();
var userQueries = require('../dataBaseQueries/userQueries')



router.post('/user', function(req, res, next) {
  userQueries.createNewUSer(req,res,next);
});
router.get('/user', function(req, res, next) {
  userQueries.getAllUsers(req,res,next);
});



module.exports = router;
