var map; 
var geocoder; 
var directionsService; 
var directionsDisplay; 

var timerSeconds;

var searchMarkers = new Array(); 

var categories = ["eat", "drink", "listen", "read", "see", "feel"]; 
$('#timeButton').click(function() {
  //var datetimepicker= $('#datetimepicker3');
  var timeInput= $('#datePickerInput');
  var timeEnd = timeInput.val().toString();//hh:mm:ss
  var hours = timeEnd.substring(0,2);
  var minutes = timeEnd.substring(3,5);
  var seconds = timeEnd.substring(6,8);
  if(hours.charAt(0) == '0') hours = hours.substring(1);
  if(minutes.charAt(0) == '0') minutes = minutes.substring(1);
  if(seconds.charAt(0) == '0') seconds = seconds.substring(1);
  var timeEndSecs = parseInt(seconds) + parseInt(minutes*60) + parseInt(hours*3600);
  var timeBegin = new Date();
  var timeBeginSecs = timeBegin.getSeconds() + (timeBegin.getMinutes()*60) + (timeBegin.getHours()*3600);
  var timeRemaining = timeEndSecs - timeBeginSecs;
  if(timeRemaining > 0){
    setAlarm(timeRemaining);
  }
});

$(document).ready(function() {
  //$('#sidebar-menu').toggle('slide');
  $('#sidebar-button').click(slideLeftMenu);
  $('.carousel').carousel(); 
})

function slideLeftMenu(e){
  e.preventDefault();
  var sidebar = $("#sidebar-menu");
  if (sidebar.css("left") == "-100px") {
    $("#sidebar-menu").animate({left:"+=100px"}, { duration: 200, queue: false});
    $("#map_canvas").animate({left:"+=100px"}, { duration: 200, queue: false});
    $("#interaction-bar").animate({right:"-=100px"}, { duration: 200, queue: false});

  } else {
    $("#sidebar-menu").animate({left:"-=100px"}, { duration: 200, queue: false});
    $("#map_canvas").animate({left:"-=100px"}, { duration: 200, queue: false});
    $("#interaction-bar").animate({right:"+=100px"}, { duration: 200, queue: false});
  }


}

function initialize() {

  //setTimeout(function(){ window.scrollTo(0, 1);}, 0);
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
routeButton.addEventListener("click", routeButtonClick);

function routeButtonClick(e) {
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

    setAlarm(5000);

    displayCategories(); 
  }


  function displayCategories() {
    // hides the form box when the categories are shown
    $("#form-group").hide();

    var categoryDiv = document.getElementById("categories"); 
    var categoryText = ""; 
    for (var i in categories) {
      categoryText += "<div class='col-xs-2 col-sm-3 col-md-2 col-lg-2 circle' id='category" + i + "'>"; 
      categoryText += "<p>"; 
      categoryText += categories[i]; 
      categoryText += "</p>"; 
      categoryText += "</div>"; 
    }
    categoryDiv.innerHTML = categoryText; 


    for (var i in categories) {
      var categoryButton = document.getElementById("category" + i); 
      categoryButton.addEventListener("click", categoryClick); 
    }
  }


  function categoryClick(e) {
    var yelpData = {"coordinates" : JSON.stringify(searchMarkers)};
    
    if (searchMarkers.length < 25) {
      $.ajax({
        url: "/places",
        type: "POST",
        context: document.body,
        data: yelpData,
        success: yelpCallback
      });
    }
  }



  function yelpCallback(data, textStatus, jqXHR) {
    $("#categories").hide();
    
    var detoursDiv = document.getElementById("detourDisplay"); 
    for (var i in data) {
      if(data[i].length > 0) {
        console.log(data[i][0].name);
        detoursDiv.appendChild(createListing(data[i][0]));
      }
    }
  }

  function createListing(listing) {
    var listingDiv = document.createElement("DIV");
    // listingDiv.className = "listing";



    // var name = document.createElement("P");
    // name.className = "name";
    // name.innerHTML = listing.name;
    // listingDiv.appendChild(name);

    listingDiv.className = "listing";
    listingDiv.innerHTML =  "<img class=\"profilePic\"/ src=\"" + listing.image_url + "\">" + 
                            "<p class=\"name\">" + listing.name + "</p>" + 
                            "<p class=\"name\">" + listing.display_phone + "</p>" +
                            "<p class=\"name\">" + listing.snippet_text + "</p>";



    return listingDiv;
  }





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
    var timerValDiv = document.getElementById("timerValue"); 
    if(timerSeconds <= 0){
      timerSeconds = 0;
      timerValDiv.innerHTML = "Time is up!"; 
      console.log("Time is up!");
      clearInterval(timerInterval);
    }else{
      var timerString = secs2timeString(timerSeconds);
    //.clearTime().addSeconds(timerSeconds).toString('H:mm:ss');
    // $('#timerValue').innerHTML = (timerString + " remaining");
    timerValDiv.innerHTML = timerString + " remaining"; 
    // console.log(timerString + " remaining.");
    //console.log(timerString + " remaining.");
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
    //console.log(response); 
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
    //console.log(duration); 

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


// var timeButton = document.getElementById("timeButton"); 
// timeButton.addEventListener("click", function(e) {
//   e.preventDefault(); 
//   var picker = $('#datetimepicker3').data('datetimepicker');
//   console.log(picker); 
// }); 