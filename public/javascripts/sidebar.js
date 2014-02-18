// var destinationButton = $('.sidebar').find('.sidebar-destination');
// var categoriesButton = $('.sidebar').find('.sidebar-activity');
// var routeButton = $('#routeButton');

// var categories = $('#categories');

// $(document).ready(function() {
//   destinationButton.addClass('active');

//   $('#sidebar-button').click(slideLeftMenu);
//   destinationButton.click(destinationScreen);
//   routeButton.click(categoriesScreen);
//   categoriesButton.click(categoriesScreen);
// })


// var sidebar = $("#sidebar-menu");

// function slideLeftMenu(e){
//   e.preventDefault();
//   if (sidebar.css("left") == "-100px") {
//     $("#sidebar-menu").animate({left:"0px"}, { duration: 200, queue: false});
//     $("#map_canvas").animate({left:"100px"}, { duration: 200, queue: false});
//     $("#interaction-bar").animate({left: "100px"}, { duration: 200, queue: false});

//   } else {
//     $("#sidebar-menu").animate({left:"-100px"}, { duration: 200, queue: false});
//     $("#map_canvas").animate({left:"0px"}, { duration: 200, queue: false});
//     $("#interaction-bar").animate({left:"0px"}, { duration: 200, queue: false});
//   }

// }

// function removeActiveClass(){
//   $('#interaction-bar').find('.active').hide();
//   $('.active').removeClass('active');
// }

// function categoriesScreen(e){
//   removeActiveClass();
//   categories.addClass('active');
//   console.log(categories);
//   console.log(categoriesButton);
//   categoriesButton.addClass('active');
//   categories.show();
// }

// function destinationScreen(e){
// 	e.preventDefault;
// 	var destinationForm = $('#interaction-bar').find('#form-group')
// 	destinationForm.show();
//   removeActiveClass();
//   $(this).addClass('active');

// }