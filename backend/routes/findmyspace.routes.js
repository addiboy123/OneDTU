const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/hostelcart/item");

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

module.exports = router;