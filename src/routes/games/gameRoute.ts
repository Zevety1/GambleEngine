import express from 'express'

const router = express.Router()

const bjRoutes = require('./blackjack/bjRoute')
router.use('/blackjack', bjRoutes)

const crapsRoutes = require('./craps/crapsRoute')
router.use('/craps', crapsRoutes)

module.exports = router;