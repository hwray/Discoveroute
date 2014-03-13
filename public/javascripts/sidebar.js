
var destinationButton = $('.sidebar').find('.sidebar-destination');
var categoriesButton = $('.sidebar').find('.sidebar-categories');
// var activitiesButton = $('.sidebar').find('.sidebar-activities');
var timeSidebarButton = $('.sidebar').find('.sidebar-time');

var routeButton = $('#routeButton');
var categoriesDiv = $('#interaction-bar').find('#categories');
var destinationForm = $('#interaction-bar').find('#form-group');
var activitiesDiv = $('#interaction-bar').find('#detourDisplay');
var timerDiv = $('#interaction-bar').find('#timer');


var detoursButton = $('.sidebar').find('.sidebar-activities');

$(document).ready(function() {
  destinationScreen();

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


  $('.info-button').click( function(event){ 
    document.getElementById('fade').style.display='block';
    document.getElementById('info-overlay').style.display='block';

    $('.topbar').css('z-index', '2000');
    $('#interaction-bar').css('z-index', '2000');

    // should not highlight discover button!
    // $('#routeButton').css('z-index', '0');

    $('.topbar').click(function(){
      resetScreen();      
    })

    $('#sidebar-button').click(function(){
      resetScreen();
    })

    $('#fade').click( function(){
      resetScreen();
    })

    $('#interaction-bar').click( function(){
      resetScreen();
    })

    function resetScreen(){
      $('#fade').hide();
      $('#info-overlay').hide();
      $('.topbar').css('z-index', '1000');
      $('#interaction-bar').css('z-index', '1000');
    }

  })


  // CHANGES
  detoursButton.click(detoursScreen);

})


function detoursScreen(e){
  var detourBar = $("#recentDetours");

  e.preventDefault(); 
  removeActiveClass(); 
  detoursButton.addClass('active'); 

  detourBar.addClass('active');
  detourBar.show();
  $('#info-text').text("checkout some of the options, and hit discover when you're ready to go!");

  $.get('/detours/get', showSavedDetours);
}


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

  $('#info-text').text('We keep track of how much time you should spend, just let us know when you need to be there!');

  timerDiv.addClass('active');
  timeSidebarButton.addClass('active');
  timerDiv.show();
  $("#time-input").focus();
  

}

function activitiesScreen(){

  removeActiveClass();

  $('#info-text').text("checkout some of the options, and click discover! when you're ready to go!");

  var detourDisplay = $('#detourDisplay');
  detourDisplay.addClass('active');
  // activitiesDiv.addClass('active');
  // activitiesButton.addClass('active');
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
  $('#info-text').text("select categories you're interested in to begin exploring");
  categoriesDiv.addClass('active');
  categoriesButton.addClass('active');
  categoriesDiv.show();
}

function destinationScreen(e){
  e.preventDefault;

  destinationScreen();

}


function destinationScreen(){
  if ($('.sidebar').find($(this)).length > 0){
    ga("send", "event", "sidebar", "click", "destination-sidebar");
  } else{
    ga("send", "event", "flow", "click", "destination-flow");
  }

  removeActiveClass();
  var destinationInfo ='';
  var textInfo = document.getElementById('info-text');
  destinationInfo = 'enter start & end addresses to begin!';
  destinationInfo += "<img src='images/orange-arrow.png' class='directions-screen-arrow center' />";

  textInfo.innerHTML = destinationInfo;

  // $('#info-text').html(destinationInfo);
  destinationButton.addClass('active');
  destinationForm.show();
  destinationForm.addClass('active');
}
