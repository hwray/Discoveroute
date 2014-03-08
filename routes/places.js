var yelpClient = require("../node_modules/yelp/index.js").createClient({
  consumer_key: "yYfw_hnSvBqGMOxsoggiQQ", 
  consumer_secret: "ocT_ORTEaWMf51qpXg_DevQ15Pk",
  token: "o8G8ptup2cX3iyI6S3S1YG317mCPYsyZ",
  token_secret: "qEIqCuvJ1rw1mkmzBuP4xRy67Cw",
});


exports.places = function(req, res) {

  var businesses = [];
  var coordinates = JSON.parse(req.body.coordinates);
  var SPREAD_POINTS = 50;
  
  var stepIncrement = (coordinates.length > SPREAD_POINTS) ? coordinates.length / SPREAD_POINTS : 1;
  var counter = coordinates.length / stepIncrement;
  for (var i = 0; i < coordinates.length; i += stepIncrement) {
   yelpClient.search(
   {
     term: req.body.category, 
     ll: coordinates[i].d + "," + coordinates[i].e,
     radius_filter: "1000", 
     limit: 5
   }, 

   function(error, data) {
    businesses.push(data.businesses);
    counter--;
    if (counter == 0) {
      res.json(businesses);
    }
 });
 }
};

