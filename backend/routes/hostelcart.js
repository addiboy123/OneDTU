const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/hostelcart/item");

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Public
router.get("/items", controller.getAllItems);
router.post("/items", upload.array("images", 5), controller.createItem);
router.put("/items", upload.array("images", 5), controller.updateItem);
router.delete("/items", controller.deleteItem);


router.get("/items/me", controller.getUserItems);
router.get("/items/others", controller.getOtherItems);
router.get("/items/by-category", controller.getItemsByCategory);
module.exports = router;