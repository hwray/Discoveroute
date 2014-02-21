
/*
 * GET home page.
 */

var models = require('../models');


exports.index = function(req, res){

	models.Detour.find().sort('date').exec(renderIndex);

	function renderIndex(err, detours) {
		res.render('index', { 'detours': detours });
	}
};