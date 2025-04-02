import { iSlot, Slot } from "../../../classes/slotsClass"
import { UserService } from "../../../services/users/user.service";
import * as express from 'express'
import { authJwtMiddleware } from "../../middleware/auth";
import { SlotsGameService } from "../../../services/slot/game/slotGame.service";
import { SlotsJackpotService } from "../../../services/slot/jackpot/slotJackpot.service";

const router = express.Router()

const slots = new Slot


router.post('/rollSlots', authJwtMiddleware, async (req, res) =>  {
    
    const bet = req.body.bet
    const userId = req.body.userId;

    if (typeof bet !== 'number' || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userService = new UserService
    const userData = await userService.getUserById(userId)

    if (userData.balance < bet || bet <= 0) {
        return res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать баланс пользователя'
        });
    }


    const slotsService = new SlotsGameService

    if (!(await slotsService.getUserById(userId))) {
        await slotsService.StartNewGame(userId, bet)
    }

    const jackpotService = new SlotsJackpotService

    const jackpotData = await jackpotService.getData()


    await jackpotService.updateData({jackpot: jackpotData.jackpot + Math.ceil(bet * 0.02)})


    const slotsResult:iSlot[] = slots.rollSlots()

    const equalSlots: boolean = slots.checkEqualSlots(slotsResult)

    let winAmount = 0

    if (equalSlots && slotsResult[0].slotValue === 'E') {
        winAmount = bet * 1.5
        await userService.plusBet(userId, winAmount + bet)
    }

    if (equalSlots && slotsResult[0].slotValue === 'D') {
        winAmount = bet * 2
        await userService.plusBet(userId, winAmount + bet) 
    }

    if (equalSlots && slotsResult[0].slotValue === 'C') {
        winAmount = bet * 3 
        await userService.plusBet(userId, winAmount + bet)
    }

    if (equalSlots && slotsResult[0].slotValue === 'B') {
        winAmount = bet * 4 
        await userService.plusBet(userId, winAmount + bet)
    }

    if (equalSlots && slotsResult[0].slotValue === 'A') {
        winAmount = bet * 5 
        await userService.plusBet(userId, winAmount + bet)
    }

    if (equalSlots && slotsResult[0].slotValue === 7) {
        winAmount = jackpotData.jackpot
        await userService.plusBet(userId, winAmount + bet)
        await jackpotService.updateData({activeJackpot: false})
        await jackpotService.createNewJackpot()
    }

    await userService.minusBet(userId, bet)
    await slotsService.updateDataById(userId, {slots: slots.rollSlots(), activeGame: false, winAmount: winAmount });

    return res.json({
        bet:bet,
        winAmount: winAmount,
        slots: slotsResult
    })

    }
)

module.exports = router;