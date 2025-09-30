const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("DB connection failed");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB; // <-- export the function directly
