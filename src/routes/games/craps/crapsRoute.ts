import Dice from "../../../classes/diceClass"
import { CrapsService } from "../../../services/craps/craps.service";
import { UserService } from "../../../services/users/user.service";
import * as express from 'express'
import { authJwtMiddleware } from "../../middleware/auth";

const router = express.Router()

const dice = new Dice


router.post('/throwDice', authJwtMiddleware, async (req, res) =>  {
    
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

    const crapsService = new CrapsService

    if (!(await crapsService.getUserById(userId))) {
        await crapsService.StartNewGame(userId, bet)
    }
    
    const crapsData = await crapsService.getUserById(userId)

    if (crapsData.betInGame !== bet) {
        return res.status(400).json({
            error:'Нельзя изменять ставку в уже начатой игре'
        })
    }

    if (crapsData.stageGame === 1) {
        const SumValue = dice.throwDice() + dice.throwDice()


        if (SumValue == 7 || SumValue == 11) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stageGame,
                message:"Win"
            })
            await userService.plusBet(userId, bet) 
            await crapsService.updateDataById(userId, {activeGame: false})
            return
        }

        if (SumValue == 2 || SumValue == 3 || SumValue == 12) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stageGame,
                message:"Lose"
            })
            await userService.minusBet(userId, bet) 
            await crapsService.updateDataById(userId, {activeGame: false})
            return
        }
        await crapsService.updateDataById(userId, {stageGame:2, setValue:SumValue})

        res.json({
            SumValue: SumValue,
            stageGame: crapsData.stageGame,
            setValue: SumValue,
            message:"Переход на второй этап"
        })
        return
    }
    

    if (crapsData.stageGame === 2) {
        const SumValue = dice.throwDice() + dice.throwDice()

        if (SumValue == crapsData.setValue) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stageGame,
                message:"Win"
            })

            await crapsService.updateDataById(userId, {activeGame: false})
            await userService.plusBet(userId, bet)  
            return
        }     


        if (SumValue == 7) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stageGame,
                message:"Lose"
            })

            await crapsService.updateDataById(userId, {activeGame: false})
            await userService.minusBet(userId, bet)  
            return
        }


        res.json({
            SumValue: SumValue,
            stageGame: crapsData.stageGame,
            setValue: crapsData.setValue,
            message:"Nothing"
        })
        return
    }
    }
)

module.exports = router;