const express = require("express");
const router = express.Router();
const multer = require("multer");
const pgController = require("../controllers/FindMySpace/pg.controller");
const pgPostController = require("../controllers/FindMySpace/pgPost.controller");
const flatController = require("../controllers/FindMySpace/flat.controller");
const authentication = require('../middleware/authentication');

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

//  Flat routes
router.get('/flats', flatController.getAllFlats);
router.get('/flat/:id', flatController.getFlatById);
router.post('/flat', authentication, upload.array('images', 6), flatController.createFlat);
router.put('/flat/:id', authentication,  upload.array('images', 6),flatController.updateFlat);
router.delete('/flat/:id', authentication, flatController.deleteFlat);


// PG routes
router.get('/PGs/', pgController.getAllPGs);
router.get('/PG/:id', pgController.getPGById);

// PG posts routes
router.get('/PGposts', pgPostController.getAllPosts);
router.get('/PGposts/:postId', pgPostController.getPostById);
router.post('/PGposts', authentication, upload.array('images', 6), pgPostController.createPost);
router.put('/PGposts/:postId', authentication, upload.array('images', 6), pgPostController.updatePost);
router.delete('/PGposts/:postId', authentication, pgPostController.deletePost);

module.exports = router;