const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api')
const getFirstPage = require('../middleware/getFirstPage')
const logSearch = require('../middleware/logSearch')

router.get('/me', apiController.me)
router.get('/negotiations', apiController.negotiations)
router.get('/getAllVacancies', getFirstPage, logSearch, apiController.getAllVacancies)

module.exports = router
