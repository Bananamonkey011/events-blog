const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const EventsSchema = new Schema({
	title: String,
	location: String,
	datetime: Date,
	created: Date,
	modified: Date,
	description: String,
	picture: String,
	attendees: [
		{
			type: Schema.Types.ObjectId,
			ref: "Users",
		}
	],
});

module.exports = mongoose.model("Events", EventsSchema);
