
var Mongoose = require('mongoose');


var DetourSchema = new Mongoose.Schema({
  "title": String,
  "date": String,
  "distance": String, 
  "duration": String,
  "category": String,
  "nameA": String,
  "addressA": String,
  "nameB": String,
  "addressB": String,
  "nameC": String,
  "addressC": String,
  "travelMode": String,
  "comment": String, 
  "image": String
});

exports.Detour = Mongoose.model('Detour', DetourSchema);


