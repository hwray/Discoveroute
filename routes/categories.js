// main page will post the search points to select category, which will 
// save the points as hidden data, which will be posted to the places page

exports.selectCategory = function (req, res) {

  res.render('categories', 
    { 
      'categories' : ["eat", "drink", "listen", "read", "see", "feel"],
      'coordinates' : []
    } );
}