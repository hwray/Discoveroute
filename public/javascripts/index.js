var map; 
var geocoder; 
var directionsService; 
var directionsDisplay; 

var timerSeconds;

var searchMarkers = new Array(); 

var categories = ["eat", "drink", "listen", "read", "see", "feel"]; 

$(document).ready(function() {
  $('#sidebar-menu').toggle('slide');
  $('#sidebar-button').click(slideLeftMenu);
})

function slideLeftMenu(e){
  e.preventDefault();
  var sidebar = $('#sidebar');
  $('#sidebar-menu').toggle('slide');
}

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

  var categoryDiv = document.getElementById("categories"); 
  var categoryText = ""; 
  for (var i in categories) {
    categoryText += "<div class='col-xs-12 col-sm-3 col-md-2 col-lg-2 circle'>"; 
    categoryText += "<p>"; 
    categoryText += categories[i]; 
    categoryText += "</p>"; 
    categoryText += "</div>"; 
  }
  categoryDiv.innerHTML = categoryText; 

  setAlarm(5000);
});


function setAlarm(seconds){
  timerSeconds = seconds;
  timerInterval = setInterval(updateTimeLeft, 1000);
}

function secs2timeString(seconds){
  var str = "";
  var hours = Math.floor(seconds/3600);
  seconds %= 3600;
  var minutes = Math.floor(seconds/60);
  seconds %= 60;
  seconds = Math.floor(seconds);
  if(hours < 10) str += "0";
  str += hours + ":";
  if(minutes < 10) str += "0";
  str += minutes + ":";
  if(seconds < 10) str += "0";
  str += seconds;
  return str;
}

function updateTimeLeft(){
  if(timerSeconds <= 0){
    timerSeconds = 0;
    console.log("Time is up!");
    clearInterval(timerInterval);
  }else{
    var timerString = secs2timeString(timerSeconds);
    //.clearTime().addSeconds(timerSeconds).toString('H:mm:ss');
    console.log(timerString + " remaining.");
    timerSeconds -= 1;
  }
}

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
    console.log(response); 
    var steps = response.routes[0].legs[0].steps; 
    var distSinceLast = 0; 
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i]; 
      if ((step.distance.value + distSinceLast) < 1000) {
        distSinceLast += step.distance.value; 
        continue; 
      } else {
        distSinceLast = 0; 
      }
      if (step.distance.value > 2000) {
        var numPoints = Math.floor(step.distance.value / 1600); 
        var increment = Math.floor(step.lat_lngs.length / numPoints); 
        var points = step.lat_lngs; 
        for (var j = increment; j < points.length; j += increment) {
          var latlng = new google.maps.LatLng(step.lat_lngs[j].d, step.lat_lngs[j].e); 
          searchMarkers.push(latlng); 
          addMarker(step.lat_lngs[j].d, step.lat_lngs[j].e); 
        }
      } else {
        var lat = step.end_location.d;
        var lng = step.end_location.e; 
        var latlng = new google.maps.LatLng(lat, lng); 
        searchMarkers.push(latlng); 
        addMarker(lat, lng); 
      }
    }
    directionsDisplay.setDirections(response);

    var duration = response.routes[0].legs[0].duration.text; 
    var durationVal = response.routes[0].legs[0].duration.value; 
    console.log(duration); 

    var timer = document.getElementById("tripTime"); 
    timer.innerHTML = "Your trip will take " + duration; 

  } else {

  }
}

function addMarker(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng); 
  var marker = new google.maps.Marker({
    map: map,
    position: latlng
  });
}

var timeButton = document.getElementById("timeButton"); 
timeButton.addEventListener("click", function(e) {
  e.preventDefault(); 
  var picker = $('#datetimepicker3').data('datetimepicker');
  console.log(picker); 
}); 