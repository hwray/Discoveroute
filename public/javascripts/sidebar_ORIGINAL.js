
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
  activitiesButton.click(categoriesScreen);

})


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
  console.log("displaying detours");
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
