const express = require('express')
const router = express.Router()
const { register, login, googleLogin} = require('../controllers/auth')

// Normal Users
router.post('/user-register', register)
router.post('/user-login', login)
router.post('/user-google-login', googleLogin)

// // Admin Users
// router.post('/admin-register', register)
// router.post('/admin-login', login)
// // router.post('/admin-google-login', googleLogin)

// // Society Admins
// router.post('/society-admin-register', register)
// router.post('/society-admin-login', login)
// // router.post('/society-admin-google-login', googleLogin)

module.exports = router