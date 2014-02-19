var map; 
var geocoder; 
var directionsService; 
var directionsDisplay; 

var timerSeconds;
var timerInterval;

var searchMarkers = new Array();

var categories = ["coffee", "food", "shopping", "cafes", "nightlife"]; 
var categoryColors = ["#A35E5A", "#FFA100", "#82105b", "#44a16c", "#379788"];

$(document).ready(function() {
  $("#categories").hide();
  displayCategories();
  $('#categoriesButton').click(categoriesClick);

});


$('#timeButton').click(function() {
  var timeInput= $('#datePickerInput');
  var timeEnd = timeInput.val().toString();//hh:mm:ss
  var timeEndSecs = parseTimeString(timeEnd);
  var timeBegin = new Date();
  var timeBeginSecs = timeBegin.getSeconds() + (timeBegin.getMinutes()*60) + (timeBegin.getHours()*3600);
  var timeRemaining = timeEndSecs - timeBeginSecs;
  setAlarm(timeRemaining);
});

function setAlarm(seconds){
  var durationText = document.getElementById("duration").innerHTML;
  var durationVal = document.getElementById("durationVal").innerHTML;
  var minDetourTime = 20*60;//minimum detour time maybe about 20 minutes, including driving/parking
  if(seconds < 0){
    //time entered is before time right now
  }else if(seconds < durationVal){
    //user better leave for destination now, rather than detour
  }else if(seconds < durationVal + minDetourTime){
    //user will not have time to take a detour unless they can be late
  }else{
    //do the detour
  }
  timerSeconds = seconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimeLeft, 1000);
}





function updateTimeLeft(){
  var timerValDiv = document.getElementById("timerValue"); 
  if(timerSeconds <= 0){
    timerSeconds = 0;
    //timerValDiv.innerHTML = "Time is up!"; 
    console.log("Time is up!");
    clearInterval(timerInterval);
  }else{
    var timerString = secs2timeString(timerSeconds);
    //.clearTime().addSeconds(timerSeconds).toString('H:mm:ss');
    //$('#timerValue').innerHTML = (timerString + " remaining");
    //timerValDiv.innerHTML = timerString + " remaining"; 
    console.log(timerString + " remaining.");
    timerSeconds -= 1;
  }
}


$(document).ready(function() {
  $('#sidebar-button').click(slideLeftMenu);
})

function slideLeftMenu(e){
  e.preventDefault();
  var sidebar = $("#sidebar-menu");
  if (sidebar.css("left") == "-100px") {
    $("#sidebar-menu").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
    $("#map_canvas").animate({left:"100px"}, { duration: 200, queue: false}, function() {});
    $("#interaction-bar").animate({left:"100px"}, { duration: 200, queue: false}, function() {});

  } else {
    $("#sidebar-menu").animate({left:"-100px"}, { duration: 200, queue: false}, function() {});
     $("#map_canvas").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
     $("#interaction-bar").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
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


function routeButtonClick(e) {
  e.preventDefault(); 
  var start = document.getElementById("routeStart").value; 
  var end = document.getElementById("routeEnd").value; 
  var vehicle = $('input[name="vehicleOptions"]:checked').val();

  var vehicleString;

  if (vehicle === 'DRIVING')
    vehicleString = google.maps.TravelMode.DRIVING;
  else if (vehicle === 'TRANSIT')
    vehicleString = google.maps.TravelMode.TRANSIT;
  else if (vehicle === 'BICYCLING')
    vehicleString = google.maps.TravelMode.BICYCLING;
  else if (vehicle === 'WALKING')
    vehicleString = google.maps.TravelMode.WALKING;


  var request = {
      origin: start,
      destination: end,
      travelMode: vehicleString, 
    };

    directionsService.route(request, directionsCallback);

    //setAlarm(5000);
  }


  function displayCategories() {
    // hides the form box when the categories are shown
    // $("#form-group").hide();

    var categoryDiv = $('.categoryGoContainer'); 
    var categoryText = ""; 
    for (var i in categories) {
      // categoryText += "<div class='col-xs-2 col-sm-3 col-md-2 col-lg-2 circle' id='category" + i + "'>"; 
      categoryText += '<input type="checkbox" class="input_hidden" name="categorySelect" id="category'+[i]+'" value="'+ categories[i]+'">';
      categoryText += '<label for="category'+[i]+'">';
      categoryText += "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6 categoryOption' id='categoryDiv" + i + "'>";
      categoryText += "<h3 class='text-center category'>"; 
      categoryText += categories[i]; 
      categoryText += "</h3>"; 
      categoryText += "</div>"; 
      categoryText += '</label>';
    }
    $(categoryDiv).before(categoryText); 


    for (var i in categories) {
      var categoryButton = document.getElementById("categoryDiv" + i); 
      $(categoryButton).css('background-color', categoryColors[i]);
      $(categoryButton).click(toggleCategorySelect);
    }
  }

  function toggleCategorySelect(e){
    $(this).toggleClass('selectedCategory');
    // console.log()
  }

  function categoriesClick(e){
    var selectedCategories = $('input[name="categorySelect"]:checked');

    for (var i = 0; i < selectedCategories.length; i++){
      var checked = selectedCategories[i].value;
      // makes a separate call for each category. can this be done in one yelp api call?
      var yelpData = {"coordinates" : JSON.stringify(searchMarkers) , "category" : checked };
      
      if (searchMarkers.length < 25) {
        $.ajax({
          url: "/places",
          type: "POST",
          context: document.body,
          data: yelpData,
          success: [yelpCallback, activitiesScreen]
          // TODO: fail callback function!
        });
      }
    }
  }



  function yelpCallback(data, textStatus, jqXHR) {
    
    var detoursDiv = document.getElementById("detourDisplay"); 
    for (var i in data) {
      if(data[i].length > 0) {
        detoursDiv.appendChild(createListing(data[i][0]));
      }
    }
  }

  function createListing(listing) {

    var listingDiv = document.createElement("DIV");

    listingDiv.className = "listing";
    listingDiv.innerHTML =  "<img class=\"profilePic\"/ src=\"" + listing.image_url + "\">" + 
                            "<p class=\"name\">" + listing.name + "</p>" + 
                            "<p class=\"name\">" + listing.display_phone + "</p>" +
                            "<p class=\"name\">" + listing.snippet_text + "</p>";



    return listingDiv;
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
    document.getElementById("duration").innerHTML = duration;
    var durationVal = response.routes[0].legs[0].duration.value;
    document.getElementById("durationVal").innerHTML = durationVal;

    //console.log(duration); 

    //var timer = document.getElementById("tripTime"); 
    //timer.innerHTML = "Your trip will take " + duration; 

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

//returns time in seconds, given "hh:mm:ss"
function parseTimeString(str){
  var hours = str.substring(0,2);
  var minutes = str.substring(3,5);
  var seconds = str.substring(6,8);
  if(hours.charAt(0) == '0') hours = hours.substring(1);
  if(minutes.charAt(0) == '0') minutes = minutes.substring(1);
  if(seconds.charAt(0) == '0') seconds = seconds.substring(1);
  return parseInt(seconds) + parseInt(minutes*60) + parseInt(hours*3600);
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

// var timeButton = document.getElementById("timeButton"); 
// timeButton.addEventListener("click", function(e) {
//   e.preventDefault(); 
//   var picker = $('#datetimepicker3').data('datetimepicker');
//   console.log(picker); 
// }); 
