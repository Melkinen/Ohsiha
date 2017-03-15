var User = require('../models/user');

var userQueries ={

createNewUSer: function(req,res,next){

      // create a new user
    var newUser = User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      admin: false
    });


  // save the user
    newUser.save(function(err) {
      if (err) throw err;

      console.log('User created!');
      res.redirect('/')
    });
},
  getAllUsers: function(req,res,next){


  User.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
    res.send(users);
});
  },

  getOneUserInformation: function(req,res,next){
    User.findOne( {_id: req.user.id}, function(err, foundUser) {
      if (err) throw err;

      // object of all the users
      console.log(foundUser);
      res.render('userInformation', {user: req.user, "foundUser": foundUser});

  });


  }



}

module.exports = userQueries ;
