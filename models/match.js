// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


// create a schema
var MatchSchema = new Schema({
  name: String,
  player1: {type: String, required: true},
  player2: {type: String, required: true},
  player1Points: {type: Number, required: true},
  player2Points: {type: Number, required: true},
  location: String,
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('Match', MatchSchema);


// make this available to our users in our Node applications
