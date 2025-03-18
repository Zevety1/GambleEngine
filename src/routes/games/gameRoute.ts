const express = require('express')
const router = express.Router()
const session = require('express-session');

const bjRoutes = require('./blackjack/bjRoute')
router.use('/blackjack', bjRoutes)

const crapsRoutes = require('./craps/crapsRoute')
router.use('/craps', crapsRoutes)

module.exports = router;