var Match = require('../models/match');

var matchQueries ={

createNewMatch: function(req,res,next){

  var d = new Date();
  var n = d.toISOString();
      // create a new user
    var newMatch = User({
      name: req.body.name,
      player1: req.body.player1,
      player2: req.body.player2,
      location: req.body.location,
      created_at: n,
      updated_at: n

    });


  // save the match
    newMatch.save(function(err) {
      if (err) throw err;

      console.log('User created!');
      res.redirect('/')
    });
},
  getAllMatches: function(req,res,next){


  Match.find({}, function(err, matches) {
    if (err) throw err;

    // object of all the users
    console.log(matches);
    res.send(matches);
  });
},
  getUsersMatches: function(req,res,next){
    Match.find({$or:[{player1: req.user.username},{player2: req.user.username}]}, function(err, matches) {
      if (err) throw err;
      // object of all the users
      console.log(matches);

      res.render('usersMatchHistory',{'user':req.user,'foundMatches': matches});
  });

}
}

module.exports = matchQueries ;
