const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin');
const adminSocietyController = require('../controllers/admin/societyAdmin');
const authenticationAdmin = require('../middleware/authentication.admin');
const adminSocietyControllerSimple = require('../controllers/admin/society');
const PgController = require('../controllers/admin/pg');




router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected: only admins can manage society admins
router.post('/create-societyadmin', authenticationAdmin, adminSocietyController.createSocietyAdmin);
router.put('/update-societyadmin', authenticationAdmin, adminSocietyController.updateSocietyAdmin);
router.delete('/delete-societyadmin', authenticationAdmin, adminSocietyController.deleteSocietyAdmin);

// Protected: only admins can manage societies
router.post('/create-society', authenticationAdmin, adminSocietyControllerSimple.createSociety);
router.put('/update-society', authenticationAdmin, adminSocietyControllerSimple.updateSociety);
router.delete('/delete-society', authenticationAdmin, adminSocietyControllerSimple.deleteSociety);

// Protected: only admins can manage PGs
router.post('/create-pg', authenticationAdmin, PgController.createPG);
router.put('/update-pg', authenticationAdmin, PgController.updatePG);
router.delete('/delete-pg', authenticationAdmin, PgController.deletePG);

module.exports = router;
