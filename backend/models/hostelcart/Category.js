const mongoose = require("mongoose");

const category_schema= new mongoose.Schema(
{
    categoryName :{
        type: String, 
        required: true, 
        unique: true
    }
});

const categories = mongoose.model("categories", category_schema);
module.exports = categories;
