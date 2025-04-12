import * as express from 'express';
import type { Request, Response } from 'express';

import type { iSlot } from '../../../classes/slotsClass';
import { Slot } from '../../../classes/slotsClass';
import { SlotsGameService } from '../../../services/slot/game/slotGame.service';
import { SlotsJackpotService } from '../../../services/slot/jackpot/slotJackpot.service';
import { UserService } from '../../../services/users/user.service';
import { authJwtMiddleware } from '../../middleware/auth';


const router = express.Router();

const slots = new Slot;

interface iSlotsRequestBody {
  bet: number;
}

router.post('/rollSlots', authJwtMiddleware, async (req:Request, res:Response):Promise<void> => {

    const userId = req.user.userId; 
    
    const { bet } = req.body as iSlotsRequestBody;


    if (!Number.isInteger(bet) || typeof bet !== 'number') {
        res.status(400).json({ error: 'Необходимы целое число bet и строка userId' });
        return;
    }

    const userService = new UserService;
    const userData = await userService.getUserById(userId);

    if (!userData) {
        res.status(500).json({
            error: 'Отсутствуют данные пользователя',
        });
        return;
    }

    if (userData.balance < bet || bet <= 0) {
        res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать баланс пользователя',
        });
        return;
    }

    const slotsService = new SlotsGameService;

    await slotsService.startNewGame(userId, bet);

    const jackpotService = new SlotsJackpotService;
    const jackpotData = await jackpotService.getData();

    if (!jackpotData) {
        res.status(500).json({
            error: 'Отсутствуют данные джекпота',
        });
        return;
    }

    await jackpotService.updateData({ jackpot: jackpotData.jackpot + 0.1 });

    const slotsResult:iSlot[] = slots.rollSlots();

    const equalSlots: boolean = slots.checkEqualSlots(slotsResult);

    let winAmount = 0;

    const winMultiply: Record<string, number> = {
        'E': 1.5,
        'D': 2,
        'C': 3,
        'B': 4,
        'A': 5,
        '7': jackpotData.jackpot,
    };

    await userService.updateDataById(userId, { balance: userData.balance - bet });

    if (equalSlots) {
        const multiplyAmount = winMultiply[slotsResult[0].slotValue.toString()];
        winAmount = Math.ceil(bet * multiplyAmount);
        await userService.updateDataById(userId, { balance: userData.balance + winAmount - bet });

        if (slotsResult[0].slotValue === 7) {
            await jackpotService.updateData({ activeJackpot: false });
            await jackpotService.createNewJackpot();
        }
    }
    
    await slotsService.updateDataById(userId, { slots: slots.rollSlots(), activeGame: false, winAmount: winAmount });

    res.json({
        bet:bet,
        winAmount: winAmount,
        slots: slotsResult,
    });
});

export default router;