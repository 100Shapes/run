var express = require('express');
var router = express.Router();
var rc = require('../controllers/race_controller');
var Datastore = require('nedb');

db = new Datastore({ filename: 'runners', autoload: true });

/* GET home page. */
router.get('/', function(req, res, next) {

	db.findOne({ start_time: { $exists: true } }).sort({ updated: -1 }).exec(function (err, start_time) {
		if(start_time == null) {
			start_time = new Date();
		}
		db.findOne({ end_time: { $exists: true } }).sort({ updated: -1 }).exec(function (err, end_time) {
			if(end_time == null) {
				end_time = new Date();
			}
			res.render('index', {
			  	title: 'Run Tracker',
			  	start_time: start_time,
			  	end_time: end_time
			});	
		});
	});
});

module.exports = router;
