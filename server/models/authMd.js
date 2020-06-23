const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authSchema = new Schema({
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	confirmPassword: {
		type: String,
		require: false
	}
},
	{ timestamps: true });

module.exports = mongoose.model('Auth', authSchema);
