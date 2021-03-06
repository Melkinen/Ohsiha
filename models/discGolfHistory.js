// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


// create a schema
var discGolfSchema = new Schema({
  description: String,
  nameOfTrack: String,
  player1: {type: String, required: true},
  created_at: Date,
  updated_at: Date,
  laneResults: Array
});

// the schema is useless so far
// we need to create a model using it
//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model("discGolfHistory", discGolfSchema);


// make this available to our users in our Node applications
