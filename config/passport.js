var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
  var opts = {};
  console.log("doing widdleware passport")
  var cookieExtractor = function(req) {
      var token = null;
      if (req && req.cookies)
      {
          token = req.cookies['token'];
          console.log(token);
      }
      return token;
  };



  opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor])
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};
