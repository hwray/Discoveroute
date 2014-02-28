
/*
 * GET home page.
 */

var models = require('../models');


exports.index = function(req, res){

	models.Detour.find().sort('date').exec(renderIndex);

	function renderIndex(err, detours) {
		res.render('index', { 
			'detours': detours,
			'sidebar': false 
		});
	}
};

exports.categoriesV2 = function (req, res){
	models.Detour.find().sort('date').exec(renderIndex2);

	function renderIndex2(err, detours) {
		res.render('indexB', { 
			'detours': detours,
			'sidebar': false 
		});
	}
}

exports.sidebarV2 = function (req, res){
	models.Detour.find().sort('date').exec(renderIndex3);

	function renderIndex3(err, detours) {
		res.render('index', { 
			'detours': detours,
			'sidebar': true 
		});
	}
}