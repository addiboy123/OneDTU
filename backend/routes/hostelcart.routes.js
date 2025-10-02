const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/hostelcart/user.items");
const authenticationMiddleware = require("../middleware/authentication");

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Public
router.get("/items", controller.getAllItems);

// Protected routes (authentication handled here)
router.post("/items", authenticationMiddleware, upload.array("images", 5), controller.createItem);
router.put("/items", authenticationMiddleware, upload.array("images", 5), controller.updateItem);
router.delete("/items", authenticationMiddleware, controller.deleteItem);

router.get("/items/me", authenticationMiddleware, controller.getUserItems);
router.get("/items/others", authenticationMiddleware, controller.getOtherItems);
router.post("/items/by-category", authenticationMiddleware, controller.getItemsByCategory);

module.exports = router;