$(document).ready(function() {
  $('#sidebar-button').click(slideLeftMenu);
  //$('.sidebar-destination').click(destinationScreen);
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


function destinationScreen(e){
	e.preventDefault;
	var destinationForm = $('#interaction-bar').find('#form-group')
	destinationForm.show();
}