import * as express from 'express';

import bjRoutes from './blackjack/bjRoute';
import crapsRoutes from './craps/crapsRoute';
import slotsRoutes from './slots/slotsRoute';

const router = express.Router();

router.use('/blackjack', bjRoutes);
router.use('/craps', crapsRoutes);
router.use('/slots', slotsRoutes);

export default router;