import * as express from 'express';
import type { Request, Response } from 'express';

import Dice from '../../../classes/diceClass';
import { CrapsService } from '../../../services/craps/craps.service';
import { UserService } from '../../../services/users/user.service';
import { betValidation } from '../../../zod/validation';
import { authJwtMiddleware } from '../../middleware/auth';

const router = express.Router();

const dice = new Dice;


router.post('/throwDice', authJwtMiddleware, async (req:Request, res:Response):Promise<void> => {

    const userId = req.user.userId; 

    const validation = betValidation.safeParse(req.body);
    if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        res.status(400).json({ error: errorMessage });
        return;
    }

    const bet = validation.data.bet;

    const userService = new UserService;
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

    const crapsService = new CrapsService;

    if (!(await crapsService.getUserGameById(userId))) {
        await crapsService.startNewGame(userId, bet);
    }
      
    const crapsData = await crapsService.getUserGameById(userId);

    if (!crapsData) {
        res.status(500).json({
            error: 'Отсутствуют данные игры',
        });
        return;
    }

    if (crapsData.bet !== bet) {
        res.status(400).json({
            error:'Нельзя изменять ставку в уже начатой игре',
        });
        return;
    }

    if (crapsData.stageGame === 1) {
        const sumValue = dice.throwDice() + dice.throwDice();

        if (sumValue === 7 || sumValue === 11) {
            await userService.updateDataById(userId, { balance: userData.balance + bet });
            await crapsService.updateDataById(userId, { activeGame: false, isWin:true });

            res.status(200).json({
                sumValue: sumValue,
                stageGame: crapsData.stageGame,
                message:'Win',
            });
            return;
        }

        if (sumValue === 2 || sumValue === 3 || sumValue === 12) {
            await userService.updateDataById(userId, { balance: userData.balance - bet });
            await crapsService.updateDataById(userId, { activeGame: false, isWin:false });
            res.status(200).json({
                sumValue: sumValue,
                stageGame: crapsData.stageGame,
                message:'Lose',
            });
            return;
        }

        await crapsService.updateDataById(userId, { stageGame:2, setValue:sumValue });

        res.status(200).json({
            sumValue: sumValue,
            stageGame: crapsData.stageGame,
            setValue: sumValue,
            message:'Переход на второй этап',
        });
        return;
    }   

    if (crapsData.stageGame === 2) {
        const sumValue = dice.throwDice() + dice.throwDice();
        
        if (sumValue === crapsData.setValue) {
            await crapsService.updateDataById(userId, { activeGame: false, isWin:true });
            await userService.updateDataById(userId, { balance: userData.balance + bet });

            res.status(200).json({
                sumValue: sumValue,
                setValue: crapsData.setValue,
                stageGame: crapsData.stageGame,
                message:'Win',
            });
            return;
        }     

        if (sumValue === 7) {
            await crapsService.updateDataById(userId, { activeGame: false, isWin:false });
            await userService.updateDataById(userId, { balance: userData.balance - bet }); 
          
            res.status(200).json({
                sumValue: sumValue,
                stageGame: crapsData.stageGame,
                message:'Lose',
            });
            return;
        }

        res.status(200).json({
            sumValue: sumValue,
            stageGame: crapsData.stageGame,
            setValue: crapsData.setValue,
            message:'Nothing',
        });
    }
});

export default router;