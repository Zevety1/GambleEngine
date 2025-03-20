import Dice from "../../../classes/diceClass"
import { UserRepo } from "../../../services/users/user.repo";
import { CrapsRepo } from "../../../services/craps/craps.repo";
import express from 'express'

const router = express.Router()

const dice = new Dice


router.post('/throwDice', async (req, res) =>  {
    
    const bet = req.body.bet
    const userId = req.body.id;

    if (typeof bet !== 'number' || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Необходимы числовой параметр bet и строка userId' });
    }

    const userRepo = new UserRepo()
    const userData = await userRepo.getUserById(userId)

    if (!userData) {
        return res.status(404).json({
            error: 'Такого пользователя не существует'
        });
    }

    if (userData.balance < bet || bet > 0) {
        return res.status(400).json({
            error: 'Ставка должна быть больше 0 и не превышать баланс пользователя'
        });
    }

    const crapsRepo = new CrapsRepo
    const crapsData = await crapsRepo.getUserById(userId)

    if (crapsData.stage_game === 1) {
        const SumValue = dice.throwDice() + dice.throwDice()


        if (SumValue == 7 || SumValue == 11) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stage_game,
                message:"Win"
            })
            await userRepo.plusBet(userId, bet) 
            return
        }

        if (SumValue == 2 || SumValue == 3 || SumValue == 12) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stage_game,
                message:"Lose"
            })
            await userRepo.minusBet(userId, bet) 
            return
        }

        await crapsRepo.updateDataById(userId, 2, SumValue)

        res.json({
            SumValue: SumValue,
            stageGame: crapsData.stage_game,
            setValue: SumValue,
            message:"Переход на второй этап"
        })
        return
    }
    

    if (crapsData.stage_game === 2) {
        const SumValue = dice.throwDice() + dice.throwDice()
        if (SumValue == crapsData.set_value) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stage_game,
                message:"Win"
            })

            await crapsRepo.updateDataById(userId, 1, 0)

            await userRepo.plusBet(userId, bet)  
            return
        }     


        if (SumValue == 7) {
            res.json({
                SumValue: SumValue,
                stageGame: crapsData.stage_game,
                message:"Lose"
            })

            await crapsRepo.updateDataById(userId, 1, 0)
            await userRepo.minusBet(userId, bet)  
            return
        }


        res.json({
            SumValue: SumValue,
            stageGame: crapsData.stage_game,
            setValue: crapsData.set_value,
            message:"Nothing"
        })
        return
    }
    }
)

module.exports = router;