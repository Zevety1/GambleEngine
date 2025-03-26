import { UserRepo } from "../services/users/user.repo";
import * as express from 'express'
import { authJwtMiddleware } from "./middleware/auth";

const router = express.Router()


router.get('/leaderboard', authJwtMiddleware, async (req, res) => {


    const userRepo = new UserRepo()
    const leaderboard = await userRepo.getTopUsers()
    
    const formattedLeaderboard = leaderboard.map(user => ({
        username: user.username,
        balance: user.balance
      }));

    res.json({
        leaderboard: formattedLeaderboard
    });

})

module.exports = router;