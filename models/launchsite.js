var mongoose = require("mongoose");

// Schema setup (setup database)
var launchsiteSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	officialSite: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
         	ref: "User"
		},
		username: String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Launchsite", launchsiteSchema);