var start_time = new Date();
var end_time = new Date();

exports.compile_time = function compile_time(hours, minutes){
	now = new Date();

	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
}

exports.get_start_time = function get_start_time(callback){
	db.findOne({ start_time: { $exists: true } }).sort({ updated: -1 }).exec(function (err, time) {
		if(time == null) {
			time = new Date();
		}
		callback(time);
	});
}

exports.get_end_time = function get_end_time(callback){
	db.findOne({ end_time: { $exists: true } }).sort({ updated: -1 }).exec(function (err, time) {
		if(time == null) {
			time = new Date();
		}
		callback(time);
	});
}

exports.set_start_time = function set_start_time(time){
	db.insert([{ start_time: time}, { updated: new Date() }], function (err, newDocs) {
		start_time = time;
	});
}

exports.set_end_time = function set_end_time(time){
	db.insert([{ end_time: time}, { updated: new Date() }], function (err, newDocs) {
		end_time = time;
	});
}


console.log(exports.get_start_time());