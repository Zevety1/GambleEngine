import  {Player}  from "../../../classes/blackJackClass";
import { UserService } from "../../../services/users/user.service";
import { BJService } from "../../../services/blackJack/blackJack.service";
import { authJwtMiddleware } from "../../middleware/auth";
import  * as express from 'express'

const router = express.Router()


const player = new Player


router.post('/drawCard', authJwtMiddleware, async (req, res) => {
    const bet = req.body.bet
    const userId = req.body.userId

    if (!(typeof bet === 'number') || !(typeof userId === 'string')) {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userService = new UserService()
    const userData = await userService.getUserById(userId)

    if (userData.balance < bet || bet <= 0) {
        return res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать баланс пользователя'
        });
    }

    const bjService = new BJService()

    if (!(await bjService.getUserById(userId))) {
        await bjService.startNewGame(userId, bet)
    }

    const bjData = await bjService.getUserById(userId)

    if (bjData.betInGame !== bet) {
        return res.status(400).json({
            error:'Нельзя изменять ставку в уже начатой игре'
        })
    }


    if (bjData.stageGame == 1) {

        await bjService.updateDataById(userId, {stageGame: 2})


        for (let i = 1; i<=2; i++) {
            await bjService.updateDataById(userId, {playerHand: player.getCard(bjData.playerHand, bjData.dealerHand)});
            await bjService.updateDataById(userId, {dealerHand: player.getCard(bjData.dealerHand, bjData.playerHand)});
        }

        res.json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand[0],
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
            message: 'Start Game. Draw or stand?'
        })

        return
  }


    if (bjData.stageGame == 2) {
        await bjService.updateDataById(userId, {playerHand: player.getCard(bjData.playerHand, bjData.dealerHand)})
        

        if (player.getSumOfHand(bjData.playerHand) > 21) {
            await bjService.updateDataById(userId, {stageGame: 1, activeGame: false})
            await userService.minusBet(userId, bet) 
            return res.json({
                stageGame: bjData.stageGame,
                playerHand: bjData.playerHand,
                dealerHand: bjData.dealerHand[0],
                sumPlayer: player.getSumOfHand(bjData.playerHand),
                sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
                message: 'Bust'
            })
        }
        

        res.json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand[0],
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
            message: 'Draw or stand?'
        })
        return
    }


})


router.post('/stand', authJwtMiddleware, async (req, res) => {
    const bet = req.body.bet
    const userId = req.body.userId

    if (!(typeof bet === 'number') || !(typeof userId === 'string')) {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userService = new UserService()
    const userData = await userService.getUserById(userId)

    if (!userData) {
        return res.status(404).json({
            error: 'Такого пользователя не существует'
        });
    }

    const bjService = new BJService()
    const bjData = await bjService.getUserById(userId)


    if (!bjData) {
        return res.status(400).json({
            error: 'Игра не начата'
        })
    }

    if (bjData.betInGame !== bet) {
        return res.status(400).json({
            error:'Нельзя изменять ставку в уже начатой игре'
        })
    }


    const sumPlayer = player.getSumOfHand(bjData.playerHand)

    while (player.getSumOfHand(bjData.dealerHand) < sumPlayer && player.getSumOfHand(bjData.dealerHand) < 17) {
        await bjService.updateDataById(userId, {dealerHand: player.getCard(bjData.dealerHand, bjData.playerHand)});
    }

    if (sumPlayer > player.getSumOfHand(bjData.dealerHand) || player.getSumOfHand(bjData.dealerHand) > 21) {
        await userService.plusBet(userId, bet)
        res.json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand,
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand),
            message: 'Win'
        })
    } else {
        await userService.minusBet(userId, bet)
        res.json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand,
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand),
            message: 'Lose'
        })
    }

    await bjService.updateDataById(userId, {stageGame: 1, activeGame: false})
    
})

module.exports = router;