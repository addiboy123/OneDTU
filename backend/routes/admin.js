const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin');
const adminSocietyController = require('../controllers/admin/societyAdmin');
const authenticationAdmin = require('../middleware/authentication.admin');
const adminSocietyControllerSimple = require('../controllers/admin/society');




router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected: only admins can create society rules
router.post('/create-societyadmin', authenticationAdmin, adminSocietyController.createSocietyAdmin);
router.post('/create-society', authenticationAdmin, adminSocietyControllerSimple.createSociety);

module.exports = router;
