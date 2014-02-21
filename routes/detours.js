var models = require('../models');

exports.getDetours = function(req, res) {

  models.Detour.find().exec(afterQuery); 

  function afterQuery(err, detours) {
    if(err) console.log(err);
    res.json(detours);
  }

}

exports.newDetour = function(req, res) {
  var data = req.body;

  var detour = new models.Detour({
    "title": data.title,
    "date": data.date,
    "distance": data.distance, 
    "duration": data.duration,
    "category": data.category,
    "nameA": data.nameA,
    "addressA": data.addressA,
    "nameB": data.nameB,
    "addressB": data.addressB,
    "nameC": data.nameC,
    "addressC": data.addressC,
    "travelMode": data.travelMode,
    "comment": data.comment, 
    "image": data.image
  }); 
  detour.save(afterSaving); 

  function afterSaving(err) {
    if(err) { console.log(err); res.send(500); }

    res.redirect("/"); 
  }
}