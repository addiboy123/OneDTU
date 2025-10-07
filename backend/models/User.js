const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
		required : false,
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
	password: {
		type: String,
		required: function () {
			// required if user is NOT a Google-only user
			return !this.googleId;
		},
	},

	Accomodations:{
		PG:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PGPost",
			}
		],
		Flat:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "FlatPost",
			}
		]
	},
	// store an array of references to items in the separate items collection
	item: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "items",
		}
	]    
});

// Hash password before saving (only if modified)
user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
user_schema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create JWT
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

user_schema.index(
  { phoneNumber: 1 },
  { unique: true, partialFilterExpression: { phoneNumber: { $type: "string" } } }
);

const user_details =  mongoose.model("users", user_schema);
module.exports = user_details;

