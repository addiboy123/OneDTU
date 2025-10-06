const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authentication');
const userController = require('../controllers/user');

// Protected: update phone number for authenticated user
router.patch('/update-phone', authenticationMiddleware, userController.updatePhoneNumber);

module.exports = router;
