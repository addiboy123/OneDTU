const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/hostelcart/item");
const categoriesController = require("../controllers/hostelcart/category");
const authenticationMiddleware = require("../middleware/authentication");

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Public
router.get("/all-items", controller.getAllItems);
router.get("/categories", categoriesController.getCategories);

// Protected routes (authentication handled here)
router.post("/items", authenticationMiddleware, upload.array("images", 5), controller.createItem);
router.patch("/items", authenticationMiddleware, upload.array("updatedImages", 5), controller.updateItem);
router.delete("/items", authenticationMiddleware, controller.deleteItem);
router.get("/items", authenticationMiddleware, controller.getUserItems);


router.get("/items/others", authenticationMiddleware, controller.getOtherItems);
router.get("/items/by-category", controller.getItemsByCategory);

module.exports = router;