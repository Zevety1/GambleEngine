import * as express from 'express'
import * as bjRoutes from './blackjack/bjRoute'
import * as crapsRoutes from './craps/crapsRoute'

const router = express.Router()

router.use('/blackjack', bjRoutes)
router.use('/craps', crapsRoutes)

module.exports = router;