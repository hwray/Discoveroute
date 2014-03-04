
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
  
  // linear flow
  routeButton.click(routeButtonClick);
  routeButton.click(timerScreen);
  $('#timeButton').click(categoriesScreen);
  //  routeButton.click(categoriesScreen);

  // sidebar button
  destinationButton.click(destinationScreen);
  timeSidebarButton.click(timerScreen);
  categoriesButton.click(categoriesScreen);

  $('.logo-button').click(destinationScreen);

  // CHANGES
  activitiesButton.click(function(e) {
    var detourBar = $("#recentDetours");

    e.preventDefault(); 
    removeActiveClass(); 
    activitiesButton.addClass('active'); 

    detourBar.addClass('active');
    detourBar.show();

    $.get('/detours/get', showSavedDetours);

  });

})



function showSavedDetours(data, status){
  var detours = data;
  var htmlString = '';
  console.log("IMAGETEXT"); 
  for (var i=0; i < data.length; i++){
    console.log(data[i].image); 
    htmlString += '<h4 class="detourName"><a>'+ data[i].title+'</a></h4>';
    htmlString += '<p class="detourFields">';
    htmlString += '<img src="' + data[i].image + '"/><br>'; 
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


function timerScreen(e){
  e.preventDefault;

  if ($('.sidebar').find($(this)).length > 0){
    ga("send", "event", "sidebar", "click", "timer-sidebar");
  } else{
    ga("send", "event", "flow", "click", "timer-flow");
  }

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

  if ($('.sidebar').find($(this)).length > 0){
    ga("send", "event", "sidebar", "click", "activities-sidebar");
  } else{
    ga("send", "event", "flow", "click", "activities-flow");
  }

  activitiesScreen();
}

function removeActiveClass(){
  $('#interaction-bar').find('.active').hide();
  $('.active').removeClass('active');
}


function categoriesScreen(e){
  e.preventDefault;

  // send GA from clicking on sidebar
  if ($('.sidebar').find($(this)).length > 0){
    ga("send", "event", "sidebar", "click", "categories-sidebar");
  } else{
    ga("send", "event", "flow", "click", "categories-flow");
  }

  removeActiveClass();
  categoriesDiv.addClass('active');
  categoriesButton.addClass('active');
  categoriesDiv.show();
}

function destinationScreen(e){
  e.preventDefault;

  if ($('.sidebar').find($(this)).length > 0){
    ga("send", "event", "sidebar", "click", "destination-sidebar");
  } else{
    ga("send", "event", "flow", "click", "destination-flow");
  }

  removeActiveClass();
  destinationButton.addClass('active');
  destinationForm.show();
  destinationForm.addClass('active');

}
