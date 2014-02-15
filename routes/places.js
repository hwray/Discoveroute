var yelpClient = require("../node_modules/yelp/index.js").createClient({
  consumer_key: "yYfw_hnSvBqGMOxsoggiQQ", 
  consumer_secret: "ocT_ORTEaWMf51qpXg_DevQ15Pk",
  token: "o8G8ptup2cX3iyI6S3S1YG317mCPYsyZ",
  token_secret: "qEIqCuvJ1rw1mkmzBuP4xRy67Cw",
});


exports.places = function(req, res) {

  var businesses = [];
  var coordinates = JSON.parse(req.body.coordinates);
  var counter = coordinates.length;
  console.log("NUMBER OF COORDINATES: " + counter);
  for (var i = 0; i < coordinates.length; i++) {

   yelpClient.search(
   {
     term: req.body.category, 
     ll: coordinates[i].d + "," + coordinates[i].e,
     radius_filter: "1000", 
     limit: 1
   }, 

   function(error, data) {
    businesses.push(data.businesses);
    counter--;
    if (counter == 0) {
      console.log(businesses.length);
     res.json(businesses);
   }
 });
 }
};

