var yelpClient = require("../node_modules/yelp/index.js").createClient({
  consumer_key: "yYfw_hnSvBqGMOxsoggiQQ", 
  consumer_secret: "ocT_ORTEaWMf51qpXg_DevQ15Pk",
  token: "o8G8ptup2cX3iyI6S3S1YG317mCPYsyZ",
  token_secret: "qEIqCuvJ1rw1mkmzBuP4xRy67Cw",
});

// exports.places = function(req, res) {
//   var counter = res.body.coordinates.length;
//   for (var i = 0; i < req.body.coordinates.length; i++) {
//     yelpClient.search(
//     {
//       term: req.body.searchTerm, 
//       ll: coords[i], 
//       radius_filter: "1000", 
//       limit: 1
//     }, 
    
//     function(error, data) {
//       result.push(data.businesses);
//       counter--;
//       if (counter == 0)
//         res.json(result);
//     });
//   }
// };


exports.places = function(req, res) {

  var counter;
  var businesses = [];

  var coords = ["37.4225,-122.1653", "34.102046,-118.020279"]
  counter = coords.length;

  for (var i = 0; i < coords.length; i++) {

    yelpClient.search(
    {
      term: "food", 
      ll: "" + coords[i], 
      radius_filter: "1000", 
      limit: 1
    }, 

    function(error, data) {
      businesses.push(data.businesses);
      counter--;
      if (counter == 0) {
        console.log(businesses.length);
        //res.json(businesses);
        res.render('places', {"businesses" : businesses});
      }
    });
  }
};

