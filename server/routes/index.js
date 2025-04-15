const express = require('express')
const router = express.Router()

router.use('/oauth', require('./oauth'))
router.use('/api', require('./api'))
router.use('/proxy', require('./proxy'))

module.exports = router