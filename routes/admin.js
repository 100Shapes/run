var express = require('express');
var router = express.Router();
var rc = require('../controllers/race_controller');

router.get('/', function(req, res, next) {

	start_time = rc.get_start_time();
	end_time = rc.get_end_time();

	res.render('admin',{
		title: 'Run Tracker Admin',
		start_time_hour: start_time.getHours(),
		start_time_min: start_time.getMinutes(),

		end_time_hour: end_time.getHours(),
		end_time_min: end_time.getMinutes()
	});
});

router.post('/', function (req, res) {
	rc.set_start_time(rc.compile_time(req.body.start_time_hour, req.body.start_time_min));
	rc.set_end_time(rc.compile_time(req.body.end_time_hour, req.body.end_time_min));
    res.send('Saved');
});

module.exports = router;
