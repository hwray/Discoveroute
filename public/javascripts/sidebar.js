
var destinationButton = $('.sidebar').find('.sidebar-destination');
var categoriesButton = $('.sidebar').find('.sidebar-categories');
var activitiesButton = $('.sidebar').find('.sidebar-activities');
var timeSidebarButton = $('.sidebar').find('.sidebar-time');

var routeButton = $('#routeButton');
var categoriesDiv = $('#interaction-bar').find('#categories');
var destinationForm = $('#interaction-bar').find('#form-group');
var activitiesDiv = $('#interaction-bar').find('#detourDisplay');
var timerDiv = $('#interaction-bar').find('#timer');


$(document).ready(function() {
  destinationButton.addClass('active');
  destinationForm.addClass('active');

  $('#sidebar-button').click(slideLeftMenu);
  // linear flow
  routeButton.click(routeButtonClick);
  routeButton.click(timerScreen);
  $('#timeButton').click(categoriesScreen);
  //  routeButton.click(categoriesScreen);

  // sidebar button
  destinationButton.click(destinationScreen);
  timeSidebarButton.click(timerScreen);
  categoriesButton.click(categoriesScreen);


  // CHANGES
  activitiesButton.click(function(e) {
    var detourBar = $("#recentDetours");

    e.preventDefault(); 
    removeActiveClass(); 
    activitiesButton.addClass('active'); 

    detourBar.addClass('active');
    detourBar.show();

    // if (detourBar.css("bottom") == "-100px") {
    //   $("#recentDetours").animate({bottom:"0px"}, { duration: 200, queue: false});
    // } else {
    //   $("#recentDetours").animate({bottom:"-100px"}, { duration: 200, queue: false});
    // }

    $.get('/detours/get', showSavedDetours);

  });

})

function showSavedDetours(data, status){
  var detours = data;
  var htmlString = '';
  for (var i=0; i < data.length; i++){
    htmlString += '<h4 class="detourName"><a>'+ data[i].title+'</a></h4>';
    htmlString += '<p class="detourFields">';
    htmlString += 'On: ' + data[i].date;
    htmlString += '<br /><b> Stopped At: </b>' + data[i].nameC;
    htmlString += '<br />&nbsp;&nbsp;&nbsp;'+ data[i].addressC;
    htmlString += '<br /><i>From:</i> ' + data[i].addressA;
    htmlString += '<br /><i>To:</i>' + data[i].addressB;
    htmlString += '<br /><br /> <a class="returnToDetours">&lt;&nbsp;Return to Saved Detours</a>'; 
    htmlString += '</p>';
  }
  $("#recentDetours").html(htmlString); 
  $('.detourName').click(toggleDetourDetails);
  $('.returnToDetours').click(returnToDetourMenu);

}


function toggleDetourDetails(e){
  $('.detourName').toggle();
  $(this).toggle();
  $(this).next('p').toggle();
}

function returnToDetourMenu(e){
  $('.detourName').show();
  $('.detourFields').hide();
}

var sidebar = $("#sidebar-menu");

function slideLeftMenu(e){
  e.preventDefault();
  if (sidebar.css("left") == "-100px") {
    $("#sidebar-menu").animate({left:"0px"}, { duration: 200, queue: false});
    $("#map_canvas").animate({left:"100px"}, { duration: 200, queue: false});
    $("#interaction-bar").animate({left: "100px"}, { duration: 200, queue: false});

  } else {
    $("#sidebar-menu").animate({left:"-100px"}, { duration: 200, queue: false});
    $("#map_canvas").animate({left:"0px"}, { duration: 200, queue: false});
    $("#interaction-bar").animate({left:"0px"}, { duration: 200, queue: false});
  }

}

function timerScreen(e){
  e.preventDefault;
  removeActiveClass();
  timerDiv.addClass('active');
  timeSidebarButton.addClass('active');
  timerDiv.show();

}

function activitiesScreen(){

  removeActiveClass();
  activitiesDiv.addClass('active');
  activitiesButton.addClass('active');
  activitiesDiv.show();
}

function showActivitiesScreen(e){
  e.preventDefault;
  activitiesScreen();
}

function removeActiveClass(){
  $('#interaction-bar').find('.active').hide();
  $('.active').removeClass('active');
}


function categoriesScreen(e){
  e.preventDefault;

  removeActiveClass();
  categoriesDiv.addClass('active');
  categoriesButton.addClass('active');
  categoriesDiv.show();
}

function destinationScreen(e){
  e.preventDefault;
  removeActiveClass();
  destinationButton.addClass('active');
  destinationForm.show();
  destinationForm.addClass('active');

}
