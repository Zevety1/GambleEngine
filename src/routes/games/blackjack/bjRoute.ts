import * as express from 'express';
import type { Request, Response } from 'express';

import { Player } from '../../../classes/blackJackClass';
import { BJService } from '../../../services/blackJack/blackJack.service';
import { UserService } from '../../../services/users/user.service';
import { betValidation } from '../../../zod/validation';
import { authJwtMiddleware } from '../../middleware/auth';


const router = express.Router();

const player = new Player;


router.post('/drawCard', authJwtMiddleware, async (req: Request, res: Response):Promise<void> => {

    const userId = req.user.userId; 

    const validation = betValidation.safeParse(req.body);
    if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        res.status(400).json({ error: errorMessage });
        return;
    }
    
    const bet = validation.data.bet;

    const userService = new UserService();
    const userData = await userService.getUserById(userId);

    if (!userData) {
        res.status(500).json({
            error: 'Отсутствуют данные пользователя',
        });
        return;
    }

    if (userData.balance < bet) {
        res.status(400).json({
            error: 'Ставка не может превышать баланс пользователя',
        });
        return;
    }

    const bjService = new BJService();

    if (!(await bjService.getUserGameById(userId))) {
        await bjService.startNewGame(userId, bet);
    }

    const bjData = await bjService.getUserGameById(userId);

    if (!bjData) {
        res.status(500).json({
            error: 'Отсутствуют данные игры',
        });
        return;
    }

    if (bjData.bet !== bet) {
        res.status(400).json({
            error:'Нельзя изменять ставку в уже начатой игре',
        });
        return;
    }

    if (bjData.stageGame === 1) {
        await bjService.updateDataById(userId, { stageGame: 2 });

        for (let i = 1; i<=2; i++) {
            await bjService.updateDataById(userId, { playerHand: player.getCard(bjData.playerHand, bjData.dealerHand) });
            await bjService.updateDataById(userId, { dealerHand: player.getCard(bjData.dealerHand, bjData.playerHand) });
        }

        res.status(200).json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand[0],
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
            message: 'Start Game. Draw or stand?',
        });
        return;
    }


    if (bjData.stageGame === 2) {
        await bjService.updateDataById(userId, { playerHand: player.getCard(bjData.playerHand, bjData.dealerHand) });
            
        if (player.getSumOfHand(bjData.playerHand) > 21) {
            await bjService.updateDataById(userId, { activeGame: false, isWin: false });
            await userService.updateDataById(userId, { balance: userData.balance - bet });
            
            res.status(200).json({
                stageGame: bjData.stageGame,
                playerHand: bjData.playerHand,        
                dealerHand: bjData.dealerHand[0],        
                sumPlayer: player.getSumOfHand(bjData.playerHand),
                sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
                message: 'Bust',
            });
            return;
        }
          

        res.status(200).json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand[0],
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand.slice(0,1)),
            message: 'Draw or stand?',
        });
        return;
    }
},
);


router.post('/stand', authJwtMiddleware, async (req:Request, res:Response):Promise<void> => {
   
    const userId = req.user.userId; 

    const userService = new UserService();
    const userData = await userService.getUserById(userId);

    if (!userData) {
        res.status(500).json({
            error: 'Отсутствуют данные пользователя',
        });
        return;
    }

    const bjService = new BJService();
    const bjData = await bjService.getUserGameById(userId);

    if (!bjData) {
        res.status(400).json({
            error: 'Игра не начата',
        });
        return;
    }

    const sumPlayer = player.getSumOfHand(bjData.playerHand);

    while (player.getSumOfHand(bjData.dealerHand) < sumPlayer && player.getSumOfHand(bjData.dealerHand) < 17) {
        await bjService.updateDataById(userId, { dealerHand: player.getCard(bjData.dealerHand, bjData.playerHand) });
    }

    if (sumPlayer > player.getSumOfHand(bjData.dealerHand) || player.getSumOfHand(bjData.dealerHand) > 21) {
        await userService.updateDataById(userId, { balance: userData.balance + bjData.bet });
        await bjService.updateDataById(userId, { activeGame: false, isWin: true });
        res.status(200).json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand,
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand),
            message: 'Win',
        });
    } else {
        await userService.updateDataById(userId, { balance: userData.balance - bjData.bet });
        await bjService.updateDataById(userId, { activeGame: false, isWin: false });
        res.status(200).json({
            stageGame: bjData.stageGame,
            playerHand: bjData.playerHand,
            dealerHand: bjData.dealerHand,
            sumPlayer: player.getSumOfHand(bjData.playerHand),
            sumDealer: player.getSumOfHand(bjData.dealerHand),
            message: 'Lose',
        });
    }
});

export default router;
