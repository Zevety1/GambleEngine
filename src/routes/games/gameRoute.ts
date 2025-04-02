import * as express from 'express'
import * as bjRoutes from './blackjack/bjRoute'
import * as crapsRoutes from './craps/crapsRoute'
import * as slotsRoutes from './slots/slotsRoute'

const router = express.Router()

router.use('/blackjack', bjRoutes)
router.use('/craps', crapsRoutes)
router.use('/slots', slotsRoutes)

module.exports = router;