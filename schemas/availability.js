(function() {
	'use strict';

	var mongoose = require('mongoose');
	var findOrCreate = require('mongoose-findorcreate');
	var Schema = mongoose.Schema;
	var availabilitySchema = new Schema(
	{
		user: {type: String},
		date: {type: Date},
		part: {
			morning: {type: Boolean, default: true},
			afternoon: {type: Boolean, default: true},
			evening: {type: Boolean, default: true}
		}
	}, { autoIndex: false });

	availabilitySchema.plugin(findOrCreate);
	module.exports = mongoose.model('Availability', availabilitySchema);

}());
