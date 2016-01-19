var yelpClient = require("../node_modules/yelp/index.js");


exports.places = function(req, res) {

  var businesses = [];
  var coordinates = JSON.parse(req.body.coordinates);

  console.log(coordinates);
  var SPREAD_POINTS = 70;

  var stepIncrement = (coordinates.length > SPREAD_POINTS) ? coordinates.length / SPREAD_POINTS : 1;
  var counter = coordinates.length / stepIncrement;

  coordinates.forEach(function(coordinate){

    yelpClient.createClient({
      consumer_key: "iy4_rKs-PmK_gHTgCRmb1A", 
      consumer_secret: "szVnY0AzT-muqHK2wDEiTgyOijo",
      token: "sT4K4iPOTCG0ZPtvZ_x9v-G85eYITnL2",
      token_secret: "qNU1OlZbg72UdQVIXZxWJIbhqkY",
    }).search(
    {
     term: req.body.category, 
     ll: coordinate.lat + "," + coordinate.lng,
     radius_filter: "1500", 
     limit: 5
    }, 

    function(error, data) {

      if (error) {
        console.log("Error with Yelp API call");
        console.log(data);
        res.status(400);
        res.send(error);
      } else {
        var results = data.businesses;

        for(var i=0; i<results.length; i++){
          var b = results[i];
          businesses.push(b);
        }
        counter--;
        if (counter === 0) {
          res.json(businesses);
        }
      }
    });
  });
};

