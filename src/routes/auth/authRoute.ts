
import * as express from 'express'
import { UserService } from "../../services/users/user.service";
import * as jwt from 'jsonwebtoken';
import { comaprePasswords } from "../..//classes/cryptClass";
import * as dotenv from 'dotenv';
dotenv.config();



const router = express.Router()


router.get('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!(typeof username === 'string') || !(typeof password === 'string')) {
        return res.status(400).json({ error: 'Неверные данные' });
    }

    const userService = new UserService()
    const userData = await userService.findByUsername(username)

    if (!userData) {
        return res.status(400).json({ error: 'Такого пользователя не существует' });
    }

    if (!(await comaprePasswords(password, userData.password))) {
        return res.status(400).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign(
        { userId: userData.id, username: userData.username },
        process.env.SECRET,
        { expiresIn: '1h' }
    );

    return res.json ({
            token: token,
            userId: userData.id,
            username: userData.username,
            balacne: userData.balance,
            message: 'Авторизация успешно выполнена'

        }) 
})


router.post('/createNewUser', async (req, res) => {

    const username = req.body.username
    const password = req.body.password

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Неверный формат данных' });
    }

    const userService = new UserService

    if (await userService.findByUsername(username)) {
        return res.status(400).json({error: 'Пользователь с таким именем уже существует'})
    }

    if (password.length < 5) {
        return res.status(400).json({error: 'Пароль слишком короткий'})
    }

    const newUserData = await userService.createNewUser(username, password)
   
    res.json({
        userId: newUserData.id,
        username: newUserData.username,
        balance: newUserData.balance,
        message: 'Пользователь успешно создан'
    })
    

})

module.exports = router;