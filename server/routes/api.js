const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api')

router.get('/me', apiController.me)
router.get('/negotiations', apiController.negotiations)
router.get('/getAllVacancies', apiController.getAllVacancies)

module.exports = router
