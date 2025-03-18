import { UserRepo } from "../services/users/user.repo";

const express = require('express')
const router = express.Router()


router.get('/leaderboard', async (req, res) => {


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