var map; 
var geocoder; 
var directionsService; 
var directionsDisplay; 

var timerSeconds;
var timerInterval;

var searchMarkers = new Array();

var origRoute; 

var detourListing; 

var pointA;
var pointB; 
var pointC; 
var mode; 

var timeAC; 
var timeCB;
var timeAB;
var timeABstring;

var destinationTime;

var detourIndex; 

var yelpListings; 

var categories = ["dining", "shopping", "cafes", "nightlife", "arts", "grocery"]; 
var categoryColors = ["#5A132c", "#761c4b", "#eed258", "#44a16c", "#379788", "#3d6585"];

$(document).ready(function() {
  $("#categories").hide();
  $('#timer').hide();
  $('#recentDetours').hide();
  $('#loading-spinner').hide();
  displayCategories();
  $('#categoriesButton').click(categoriesClick);

});


$('#timeButton').click(function() {
  var timeInput= $('#datetimepicker4').find('input');
  var timeEnd = timeInput.val().toString();//hh:mm:ss
  var momentTime = new Date(timeInput);
  var timeEndSecs = parseTimeString(timeEnd);

  var timeBegin = new Date();
  var timeBeginSecs = timeBegin.getSeconds() + (timeBegin.getMinutes()*60) + (timeBegin.getHours()*3600);
  var timeRemaining = timeEndSecs - timeBeginSecs;
  var extraTime = timeRemaining - timeAB;
  var minDetourTime = 15*60; // 15 minutes
  if(timeRemaining < 0){
    console.log("Please select a time after the present time");
  }else if(extraTime < 0){
    console.log("No time for a detour! Either reconsider your arrival time or get to where you're going now!");
  }else if(extraTime < minDetourTime){
    console.log("Warning: you only have an estimated " + secs2timeString(extraTime) + " extra time to detour. Detour wisely.");
  }else{
    console.log("Excellent! You have an estimated " + secs2timeString(extraTime) + " of detour time.");
  }
  destinationTime = timeEndSecs;
});

function setAlarm(seconds){

  timerSeconds = seconds;
  clearInterval(timerInterval);  
  timerInterval = setInterval(updateTimeLeft, 1000);
}





function updateTimeLeft(){
  var timerValDiv = document.getElementById("timer-text"); 
  if(timerSeconds <= 0){
    timerSeconds = 0;
    timerValDiv.innerHTML = "Time is up!"; 
    clearInterval(timerInterval);
  }else{
    var timerString = secs2timeString(timerSeconds);
    timerValDiv.innerHTML = timerString + " remaining.";
    timerSeconds -= 1; 
  }
  activateLightBox();
  $('.continue-from-timer').click(function() {
    clearInterval(timerInterval);
  });   
}

function activateLightBox(){
  $('.lightbox').click(function(){
    $('.lightbox').hide();
  })
  document.getElementById('light').style.display='block';
  document.getElementById('fade').style.display='block';
}


$(document).ready(function() {
  $('#sidebar-button').click(slideLeftMenu);
})

function slideLeftMenu(e){
  e.preventDefault();

  ga("send", "event", "sidebar", "click", "v2-sidebar");


  e.stopPropagation();
  var sidebar = $("#sidebar-menu");
  if (sidebarIsVisible()) {
    slideHide();
  } else {
    slideView();
  }
}

function sidebarIsVisible() {
  return (sidebar.css("left") == "0px")
}

function slideView() {
  $("#sidebar-menu").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
  $("#map_canvas").animate({left:"100px"}, { duration: 200, queue: false}, function() {});
  $("#interaction-bar").animate({left:"100px"}, { duration: 200, queue: false}, function() {});
}

function slideHide() {
  $("#sidebar-menu").animate({left:"-100px"}, { duration: 200, queue: false}, function() {});
  $("#map_canvas").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
  $("#interaction-bar").animate({left:"0px"}, { duration: 200, queue: false}, function() {});
}

function initialize() {

  //setTimeout(function(){ window.scrollTo(0, 1);}, 0);
  var map_canvas = document.getElementById('map_canvas');
  var map_options = {
    center: new google.maps.LatLng(37.424, -122.166),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP, 
    mapTypeControl: false
  }
  map = new google.maps.Map(map_canvas, map_options)
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var inputStart = /** @type {HTMLInputElement} */(
      document.getElementById('routeStart'));
  var autocompleteStart = new google.maps.places.Autocomplete(inputStart);
  autocompleteStart.bindTo('bounds', map);


  var inputEnd = /** @type {HTMLInputElement} */(
      document.getElementById('routeEnd'));
  var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd);
  autocompleteEnd.bindTo('bounds', map);

  if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
      map.setCenter(currentLocation);
      addMarker(position.coords.latitude, position.coords.longitude); 
    });
  } else {
    /* geolocation IS NOT available */

  }


  $("html").click(function(event) {
    if (sidebarIsVisible)
      slideHide();
  });

  $("#sidebar-menu").click(function(event) {
    event.stopPropagation();
  });

  $($("#sidebar-list").children()[1].children).toggle();
  $($("#sidebar-list").children()[2].children).toggle();
}

google.maps.event.addDomListener(window, 'load', initialize);


function routeButtonClick(e) {

  $($("#sidebar-list").children()[1].children).toggle();
  $($("#sidebar-list").children()[2].children).toggle();

  // add GA about timing category click

  var startTime = new Date().getTime();
  $('.categoryOption').click(timeCategories);

  function timeCategories(event){
    var endTime = new Date().getTime();
    var timeSpent = endTime - startTime;
    ga("send", "timing", "first-timer",'category', timeSpent);
    ga("send", "event", "select-category", "click", 'category', timeSpent);
  }
  
  $('#categoriesButton').click(timeFinishCategories);
  function timeFinishCategories(event){
    var endTime = new Date().getTime();
    var timeSpent = endTime - startTime;
    ga("send", "timing", "discover-timer",'category', timeSpent);
    ga("send", "event", "discover-category", "click", 'category', timeSpent);
  }

  //end GA


  displayOptions();
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

  requestDirections(start, end, vehicleString, showDirections); 

}

function displayOptions() {
  
}


function requestDirections(start, end, vehicle, callback) {
  var request = {
    origin: start,
    destination: end,
    travelMode: vehicle 
  };

  directionsService.route(request, callback);
}

function displayCategories() {
  console.log("displaying categories");

  var categoryDiv = $('#categories-form'); 
  var categoryText = ""; 
  for (var i in categories) {
      // categoryText += "<div class='col-xs-2 col-sm-3 col-md-2 col-lg-2 circle' id='category" + i + "'>"; 
      categoryText += '<input type="checkbox" class="input_hidden" name="categorySelect" id="category'+[i]+'" value="'+ categories[i]+'">';
      categoryText += '<label for="category'+[i]+'">';
      categoryText += "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6 categoryOption categoryV2' id='categoryDiv" + i + "'>";
      categoryText += "<h3 class='text-center category'>"; 
      categoryText += categories[i]; 
      categoryText += "</h3>"; 
      categoryText += "</div>"; 
      categoryText += '</label>';
    }
    $(categoryDiv).before(categoryText); 

    for (var i in categories) {
      var categoryButton = document.getElementById("categoryDiv" + i); 
      // $(categoryButton).css('background-color', categoryColors[i]);
      //$(categoryButton).click(toggleCategorySelect);
      $(categoryButton).click(function() {
        $(this).toggleClass('selectedCategoryV2');
        if ($(".selectedCategoryV2").length == 0) {
          $("#categoriesButton").attr("disabled", "true");
        } else {
          $("#categoriesButton").removeAttr("disabled");
        }
      });
    }
}

  function categoriesClick(e){
    var searchString = "";

    var selectedCategories = $('input[name="categorySelect"]:checked');
    for (var i = 0; i < selectedCategories.length; i++) {
      var checked = selectedCategories[i].value;
      searchString += checked;
      if (i != selectedCategories.length - 1)
        searchString += ','
    }

    var yelpData = {"coordinates" : JSON.stringify(searchMarkers), 'category': searchString};
    
    if (searchMarkers.length > 0) {
      $.ajax({
        url: "/places",
        type: "POST",
        context: document.body,
        data: yelpData,
        beforeSend: function() { $('#loading-spinner').show(); },
        success: [yelpCallback, activitiesScreen]
      });
    }
  }

  function toggleCategorySelect(e){
    $(this).toggleClass('selectedCategoryV2');
  }

  function yelpCallback(data, textStatus, jqXHR) {

    $('#loading-spinner').hide();
    yelpListings = []; 

    var detoursDiv = document.getElementById("detourDisplay"); 
    var displayIndex = 0;

    // remove all elements currently in the detourDiv
    while(detoursDiv.hasChildNodes()){
      detoursDiv.removeChild(detoursDiv.lastChild);
    }

    for (var i = 0; i < data.length; i++) {
      if(data[i].length > 0) {
        // add listing div to carousel
        detoursDiv.appendChild(createListing(data[i][0], displayIndex));
        displayIndex++;
        yelpListings.push(data[i]);
        // add marker to map
        var addressString = data[i][0].location.display_address[0] + ", " + data[i][0].location.display_address[1]; 
        var request = {
          address: addressString
        }
        geocoder.geocode(request, function(result, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            addMarker(result[0].geometry.location.d, result[0].geometry.location.e); 
          } else {
            // error while geocoding address to lat-lng
          }
        }); 
      }
    }
  }

  function createListing(listing, index) {
    var listingDiv = document.createElement("DIV");
    listingDiv.className = "listing";
    listingDiv.id = "listing" + index;
    var listingImg = document.createElement("img"); 
    listingImg.setAttribute("class", "profilePic"); 
    listingImg.setAttribute("src", listing.image_url); 
    listingDiv.appendChild(listingImg); 
    listingDiv.appendChild(createFunctionDetail(listing.name, "name"));
    // listingDiv.appendChild(createFunctionDetail(listing.display_phone, "phone_num"));

    var expandButton = document.createElement("span"); 
    expandButton.setAttribute('class', 'fa fa-chevron-circle-up'); 
    expandButton.setAttribute('style', "color:#FF9805; font-size:16pt;"); 
    listingDiv.appendChild(expandButton);

    var listingInfo = document.createElement("p");
    listingInfo.innerHTML = listing.location.display_address;
    listingInfo.className = 'listingInfo'

    // console.log(listing);

    listingInfo.innerHTML += '<br />' + listing.snippet_text;
    listingInfo.style.display = 'none';
    listingDiv.appendChild(listingInfo);

    var expandListing = function() {

      $(listingDiv).css("min-width", $("body").width()-5);
      // $(listingDiv).height($("body").height() * 0.8);
      $(".listing").hide();
      $(listingDiv).show();

      // switch what buttons are displayed 
      $(listingDiv).children("button").toggle();
      $(listingDiv).children("span").toggle();
      $(listingDiv).find('.listingInfo').toggle();
    }; 

    var hideListing = function() {
      $(listingDiv).children("button").toggle();
      $(listingDiv).children("span").toggle();
      $(listingDiv).find('.listingInfo').toggle();
      $(".listing").removeAttr("style");
    }; 

    expandButton.onclick = expandListing; 

    listingImg.onclick = function() {
      if ($(listingDiv).find('.listingInfo').css("display") == "none") {
        expandListing(); 
      } else {
        hideListing(); 
      }
    }; 

    var discoverButton = document.createElement("button");
    discoverButton.setAttribute('class', 'btn');
    discoverButton.setAttribute('class', 'btn-default');
    discoverButton.setAttribute('class', 'discoverButton'); 
    discoverButton.innerHTML = "Discover!";
    discoverButton.style.display = "none";
    listingDiv.appendChild(discoverButton);

    listingDiv.appendChild(document.createElement("br")); 
    listingDiv.appendChild(document.createElement("br")); 

    var returnButton = document.createElement("span"); 
    returnButton.setAttribute('class', 'fa fa-chevron-circle-down'); 
    returnButton.setAttribute('style', "color:#FF9805; font-size:16pt;"); 
    returnButton.style.display = "none";
    listingDiv.appendChild(returnButton);

    returnButton.onclick = hideListing; 


    discoverButton.onclick = function() {

      //$("#interaction-bar").css("max-height", "90%");
      var listingDiv = this.parentNode; 
      $(listingDiv).children("button").toggle();
      $(listingDiv).children("span").hide();

      var listingID = listingDiv.id.substring(7); 
      var listing = yelpListings[listingID][0]; 
      detourListing = yelpListings[listingID][0]
      detourIndex = listingID; 
      var addressString = listing.location.display_address[0] + ", " + listing.location.display_address[1]; 
      pointC = addressString; 
      pointA = origRoute.routes[0].legs[0].start_location; 
      pointB = origRoute.routes[0].legs[0].end_location; 
      mode = origRoute.Tb.travelMode; 

      $(listingDiv).children("p").children("a").hide();

      // Get directions from pointA (origin) to pointC (detour)
      requestDirections(pointA, pointC, mode, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          timeAC = response.routes[0].legs[0].duration.value; 

          var detourDiv = document.createElement('div');
          detourDiv.setAttribute('class', 'detour-directions');
          document.getElementById("listing" + detourIndex).appendChild(detourDiv);

          listDirections(response, status, detourDiv); 
          
          // Get directions from pointC (detour) to pointB (destination)
          continueToDestination(detourDiv);

        } else {
          // error while retrieving directions
        }
      }); 
    }
    
    $(listingDiv).children("a").wrap(document.createElement("p"));

    return listingDiv;
  }


  function createFunctionDetail(displayText, className) {
    var elem = document.createElement("p");
    elem.className = className;
    elem.innerHTML = displayText;
    return elem;
  }

  function continueToDestination(detourDiv){

    var nextDirections = document.createElement("div");
    nextDirections.setAttribute('class', 'continue-directions');
    
    var continueButton = document.createElement("button");
    continueButton.setAttribute('class', 'continueButton');
    continueButton.setAttribute('class', 'btn');
    continueButton.setAttribute('class', 'btn-default');
    continueButton.setAttribute('class', 'discoverButton'); 
    continueButton.innerHTML = "I've arrived at my detour! ";
    
    nextDirections.appendChild(continueButton);
    document.getElementById("listing" + detourIndex).appendChild(nextDirections);

    continueButton.onclick = function() {
      var timeBegin = new Date();
      var timeBeginSecs = timeBegin.getSeconds() + (timeBegin.getMinutes()*60) + (timeBegin.getHours()*3600);

      $(this).hide();

      requestDirections(pointC, pointB, mode, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          timeCB = response.routes[0].legs[0].duration.value; 

          setAlarm(destinationTime - timeBeginSecs - timeCB);
          activateLightBox();
          $('.detour-directions').hide();
          listDirections(response, status, nextDirections); 

          $(".continue-directions").append("<br><br>");
          var doneText = document.createElement("p"); 
          doneText.setAttribute('id', 'doneText'); 
          doneText.innerHTML = "<b>Arrived at your destination?</b>"
          $(".continue-directions").append(doneText);

          var saveButton = document.createElement("button");
          saveButton.setAttribute('class', 'btn');
          saveButton.setAttribute('class', 'btn-default');
          saveButton.setAttribute('class', 'discoverButton'); 
          saveButton.innerHTML = "Save this detour!";
          $(".continue-directions").append(saveButton);

          $(".continue-directions").append("  ");

          var exitButton = document.createElement("button");
          exitButton.setAttribute('class', 'btn');
          exitButton.setAttribute('class', 'btn-default');
          exitButton.setAttribute('class', 'discoverButton'); 
          exitButton.innerHTML = "Meh. Let's try again.";
          $(".continue-directions").append(exitButton);

          saveButton.onclick = function(e) {
            e.preventDefault(); 

            var checkText = document.getElementById("detourTitleText"); 
            if (checkText == null) {
              var titleText = document.createElement("textarea"); 
              titleText.setAttribute('id', 'detourTitleText')
              titleText.setAttribute('placeholder', 'Enter a name for this detour!'); 
              $("#doneText").after(titleText);
              $('#detourTitleText').after("<br>"); 
            } else {
              saveDetour(); 
            }
          }

          exitButton.onclick = function(e) {
            window.location.href = '/';
          }


        } else {
          // error while retrieving directions
        }
      });
}
}

  function saveDetour() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;

    var title = $('#detourTitleText').val(); 
    var date = today;
    var distance = origRoute.routes[0].legs[0].distance.text;
    var duration = origRoute.routes[0].legs[0].duration.text; 
    var category = "none";
    var nameA = origRoute.Tb.origin;
    var nameB = origRoute.Tb.destination;
    var nameC = detourListing.name;
    var addressA = origRoute.routes[0].legs[0].start_address; 
    var addressB = origRoute.routes[0].legs[0].end_address; 
    var addressC = detourListing.location.display_address[0] + " " + detourListing.location.display_address[1]; 
    var travelMode = origRoute.Tb.travelMode;
    var image = detourListing.image_url;

    var json = {
      "title": title,
      "date": date,
      "distance": distance, 
      "duration": duration,
      "category": category,
      "nameA": nameA,
      "addressA": addressA,
      "nameB": nameB,
      "addressB": addressB,
      "nameC": nameC,
      "addressC": addressC,
      "travelMode": travelMode,
      "comment": "No comment", 
      "image": image
    };



    $.post('/detours/new', json, function() {
      window.location.href = '/'; // reload the page
    });
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


function showDirections(response, status) {
  if (status == google.maps.DirectionsStatus.OK) {
      origRoute = response; // jQuery.extend(true, {}, response);
      pointA = response.Tb.origin; 
      pointB = response.Tb.destination; 
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
            //addMarker(step.lat_lngs[j].d, step.lat_lngs[j].e); 
          }
        } else {
          var lat = step.end_location.d;
          var lng = step.end_location.e; 
          var latlng = new google.maps.LatLng(lat, lng); 
          searchMarkers.push(latlng); 
          //addMarker(lat, lng); 
        }
      }
      directionsDisplay.setDirections(response);

      var duration = response.routes[0].legs[0].duration.text;
      var durationVal = response.routes[0].legs[0].duration.value;
      timeAB = durationVal;
      timeABstring = duration;

    //console.log(duration); 

  } else {

  }
}

function listDirections(response, status, displayDiv) {
  if (status == google.maps.DirectionsStatus.OK) {
    dirDiv = displayDiv
    var detourSteps = response.routes[0].legs[0].steps; 
    var origSteps = origRoute.routes[0].legs[0].steps; 
    var directions = response.routes[0].legs[0].distance.text + ", " + response.routes[0].legs[0].duration.text + "</br>"; 
    directions += "<b>START:</b> " + origRoute.routes[0].legs[0].start_address;
    directions += "<ol>" 
    for (var i = 0; i < origSteps.length; i++) {
      if (i >= detourSteps.length) 
        break; 
      
      if (origSteps[i].instructions == detourSteps[i].instructions) {
        // step is the same as original route
        directions += "<li>" + origSteps[i].instructions + "</li>"; 
      } else {
        // step diverges from the original route; follow detour steps from here on out
        directions += "<li><b>INSTEAD OF:</b> " + origSteps[i].instructions + "</li>"; 
        directions += "<li><b>DO THIS:</b> " + detourSteps[i].instructions + "</li>"; 
        break; 
      }
    }
    for (var j = i + 1; j < detourSteps.length; j++) {
      directions += "<li>" + detourSteps[j].instructions + "</li>"; 
    }

    directions += "</ol>"; 
    directions += "<b>END:</b> " + response.routes[0].legs[0].end_address; 

    dirDiv.innerHTML += directions; 
    directionsDisplay.setDirections(response);
  } else {

  }
}


function addMarker(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng); 
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    animation: google.maps.Animation.DROP
  });
}

//returns time in seconds, given "hh:mm AM/PM"
function parseTimeString(str){
  var colonDelim = str.search(':');
  var spaceDelim = str.search (' ');
  var hours = str.substring(0, colonDelim);
  var minutes = str.substring(colonDelim + 1, spaceDelim);
  var AmPm = str.substring(spaceDelim + 1);
  if(AmPm == 'PM') hours = parseInt(hours) + 12;
  if(minutes.charAt(0) == '0') minutes = minutes.substring(1);
  return parseInt(minutes*60) + parseInt(hours*3600);
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
