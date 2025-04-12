import * as express from 'express';
import type { Request, Response } from 'express';

import { UserRepo } from '../services/users/user.repo';

import { authJwtMiddleware } from './middleware/auth';

const router = express.Router();

router.get('/leaderboard', authJwtMiddleware, async (req: Request, res:Response):Promise<void> => {

    const userRepo = new UserRepo();
    const leaderboard = await userRepo.getTopTenUsers();
      
    const formattedLeaderboard = leaderboard.map(user => ({
        username: user.username,
        balance: user.balance,
    }));

    res.json({
        leaderboard: formattedLeaderboard,
    });
    return;
});

export default router;