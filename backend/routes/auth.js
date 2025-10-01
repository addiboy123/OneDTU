const express = require('express')
const router = express.Router()
const { register, login, googleLogin} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)

module.exports = router