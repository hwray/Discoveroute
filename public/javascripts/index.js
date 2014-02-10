var map; 
var geocoder; 
var directionsService; 
var directionsDisplay; 



function initialize() {
  var map_canvas = document.getElementById('map_canvas');
  var map_options = {
    center: new google.maps.LatLng(37.424, -122.166),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(map_canvas, map_options)
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);


var routeButton = document.getElementById("routeButton"); 

routeButton.addEventListener("click", function(e) { 
  e.preventDefault(); 
  var start = document.getElementById("routeStart").value; 
  var end = document.getElementById("routeEnd").value; 

  var request = {
      origin: start,
      destination: end,

      // HARDCODING
      // DRIVING
      // TRAVEL MODE
      // FOR NOW
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, directionsCallback);
});

function geocodeCallback(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    map.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location
    });
  } else {
    alert('Geocode was not successful for the following reason: ' + status);
  }
}

function directionsCallback(response, status) {
  if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
  } else {

  }
}