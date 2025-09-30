const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({ 
	profile_photo_url : {
		type : String
	},
    
	name : {
		type : String,
		required : true
	},

	phoneNumber : {
		type : String,
		required : true,
		unique: true,
		validate: {
			validator: function(v) {
				return /^\d{10}$/.test(v); // simple 10-digit validation
			},
			message: props => `${props.value} is not a valid phone number!`
		}
	},

	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
			},
			message: props => `${props.value} is not a valid email!`
		}
	},
    googleId: {
        type: String,
        unique: true,
        sparse: true, // allow multiple nulls
    },
	password : {
		type : String,
		required : true
	},
	// store an array of references to items in the separate items collection
	item: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "items",
		}
	]    
});

user_schema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,      // mongo ObjectId of the user
      name: this.name,       // user’s name
      email: this.email,      // (optional, include anything else you need)
      phoneNumber: this.phoneNumber // (optional, include anything else you need)
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME || "1d" }  // default: 1 day
  );
};

const user_details =  mongoose.model("users", user_schema);
module.exports = user_details;

