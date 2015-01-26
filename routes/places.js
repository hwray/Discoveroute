var yelpClient = require("../node_modules/yelp/index.js");


exports.places = function(req, res) {

  var businesses = [];
  var coordinates = JSON.parse(req.body.coordinates);
  var SPREAD_POINTS = 50;
  
  var stepIncrement = (coordinates.length > SPREAD_POINTS) ? coordinates.length / SPREAD_POINTS : 1;
  var counter = coordinates.length / stepIncrement;
  for (var i = 0; i < coordinates.length; i += stepIncrement) {

   yelpClient.createClient({
    consumer_key: "iy4_rKs-PmK_gHTgCRmb1A", 
    consumer_secret: "szVnY0AzT-muqHK2wDEiTgyOijo",
    token: "sT4K4iPOTCG0ZPtvZ_x9v-G85eYITnL2",
    token_secret: "qNU1OlZbg72UdQVIXZxWJIbhqkY",
  }).search(
  {
   term: req.body.category, 
   ll: coordinates[i].G + "," + coordinates[i].k,
   radius_filter: "1000", 
   limit: 5
 }, 

 function(error, data) {
  console.log(data);

  if (error) {
    console.log("Error with Yelp API call");
    console.log(data);
    res.status(400);
    res.send(error);
  } else {
    console.log(data.businesses);
    businesses.push(data.businesses);
    counter--;
    if (counter == 0) {
      res.json(businesses);
    }
  }
});
}
};

