// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var discGolfLaneSchema = new Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  numberOfLanes: Number,
  topography: String,
  description: String,
  arrayOfFairways: Array
});

// the schema is useless so far
// we need to create a model using it
//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('discGolfLane', discGolfLaneSchema);


// make this available to our users in our Node applications
