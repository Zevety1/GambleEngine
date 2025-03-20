
import { UserRepo } from "../../../services/users/user.repo";
import  Player  from "../../../classes/blackJackClass";
import { BJRepo } from "../../../services/blackJack/blackJack.repo";
import express from 'express'

const router = express.Router()

const numbers:string[] = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const suits:string[] = ['D', 'H', 'S', 'C']

const player = new Player


router.post('/drawCard', async (req, res) => {
    const bet = req.body.bet
    const userId = req.body.userId

    if (!(typeof bet === 'number') || !(typeof userId === 'string')) {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userRepo = new UserRepo()
    const userData = await userRepo.getUserById(userId)

    if (!userData) {
        return res.status(404).json({
            error: 'Такого пользователя не существует'
        });
    }

    if (userData.balance < bet || bet < 1) {
        return res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать баланс пользователя'
        });
    }

    const bjRepo = new BJRepo()
    const bjData = await bjRepo.getUserById(userId)

    if (!req.session.game) {
        req.session.game = {
            deck: [],
            playerHand: [],
            dealerHand: [],
            message: '',
        };
    }

    const game = req.session.game;

    if (bjData.stage_game == 1) {

        await bjRepo.updateDataById(userId, 2)
        game.playerHand = []
        game.dealerHand = []
        game.deck = []
        game.message = 'Draw or stand?'

        for (let number of numbers) {
            for (let suit of suits) {
            game.deck.push(number + suit);
            }
        }

        for (let i = 1; i<=2; i++) {
            player.getCard(game.deck, game.playerHand)
            player.getCard(game.deck, game.dealerHand)
        }

        res.json({
            stageGame: bjData.stage_game,
            playerHand: game.playerHand,
            dealerHand: game.dealerHand[0],
            sumPlayer: player.getSumOfHand(game.playerHand),
            sumDealer: player.getSumOfHand(game.dealerHand.slice(0,1)),
            message: game.message
        })

        return
  }


    if (bjData.stage_game == 2) {
        player.getCard(game.deck, game.playerHand)
        

        if (player.getSumOfHand(game.playerHand) > 21) {
            game.message = 'Bust'
            await bjRepo.updateDataById(userId, 1)
            await userRepo.minusBet(userId, bet) 
        }

        res.json({
            stageGame: bjData.stage_game,
            playerHand: game.playerHand,
            dealerHand: game.dealerHand[0],
            sumPlayer: player.getSumOfHand(game.playerHand),
            sumDealer: player.getSumOfHand(game.dealerHand.slice(0,1)),
            message: game.message
        })
        return
    }


})


router.post('/stand', async (req, res) => {
    const bet = req.body.bet
    const userId = req.body.userId

    if (!(typeof bet === 'number') || !(typeof userId === 'string')) {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userRepo = new UserRepo()
    const userData = await userRepo.getUserById(userId)

    if (!userData) {
        return res.status(404).json({
            error: 'Такого пользователя не существует'
        });
    }

    if (userData.balance < bet || bet < 1) {
        return res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать ваш баланс'
        });
    }

    const bjRepo = new BJRepo()
    await bjRepo.updateDataById(userId, 3)
    const bjData = await bjRepo.getUserById(userId)

    if (!req.session.game) {
        return res.status(400).json({ error: 'Игра не начата' });
      }
      const game = req.session.game;

    const sumPlayer = player.getSumOfHand(game.playerHand)

    while (player.getSumOfHand(game.dealerHand) < sumPlayer && player.getSumOfHand(game.dealerHand) < 17) {
        player.getCard(game.deck, game.dealerHand)
    }

    if (sumPlayer > player.getSumOfHand(game.dealerHand) || player.getSumOfHand(game.dealerHand) > 21) {
        game.message = 'Win'
        await userRepo.plusBet(userId, bet)
    } else {
        game.message = 'Lose'
        await userRepo.minusBet(userId, bet)
    }

    await bjRepo.updateDataById(userId, 1)

    res.json({
        stageGame: bjData.stage_game,
        playerHand: game.playerHand,
        dealerHand: game.dealerHand,
        sumPlayer: player.getSumOfHand(game.playerHand),
        sumDealer: player.getSumOfHand(game.dealerHand),
        message: game.message
    })

    

})

module.exports = router;