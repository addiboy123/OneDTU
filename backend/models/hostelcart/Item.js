
const mongoose = require("mongoose");

// Define a schema for the `item` document
const itemSchema = new mongoose.Schema({
	itemName: {
		type: String,
		required: true,
	},
	itemDescription: {
		type: String,
		default: "",
	},
	itemPrice: {
		type: Number,
		required: true,
	},
	itemCategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "categories",
	},
	itemPictures: [
		{
			type: String,
		}
	],
}, { timestamps: true });

const Item = mongoose.model("items", itemSchema);
module.exports = Item;

