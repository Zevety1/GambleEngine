
import { UserRepo } from "../../services/users/user.repo";
import { BJRepo } from "../../services/blackJack/blackJack.repo";
import { CrapsRepo } from "../../services/craps/craps.repo";
import express from 'express'



//const express = require('express')
const router = express.Router()


router.get('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!(typeof username === 'string') || !(typeof password === 'string')) {
        return res.status(400).json({ error: 'Неверные данные' });
    }

    const userRepo = new UserRepo()
    const userData = await userRepo.findByUsername(username)

    if (!userData) {
        return res.status(400).json({ error: 'Такого пользователя не существует' });
    }

    if (!(userData.password == password)) {
        return res.status(400).json({ error: 'Неверный пароль' });
    }

    return res.json ({
            userId: userData.id,
            username: userData.username,
            balacne: userData.balance,
            message: 'Авторизация успешно выполнена'

        }) 
})


router.post('/reg', async (req, res) => {

    const username = req.body.username
    const password = req.body.password

    if (!(typeof username === 'string') || !(typeof password === 'string')) {
        return res.status(400).json({ error: 'Неверный формат данных' });
    }

    const userRepo = new UserRepo()

    if (await userRepo.findByUsername(username)) {
        return res.status(400).json({error: 'Пользователь с таким именем уже существует'})
    }

    if (password.length < 5) {
        return res.status(400).json({error: 'Пароль слишком короткий'})
    }

    const bjRepo = new BJRepo()
    const creapsRepo = new CrapsRepo()

    const newUser = await userRepo.regUser(username, password)

    await bjRepo.newUser(newUser.id)
    await creapsRepo.newUser(newUser.id)
   
    res.json({
        userId: newUser.id,
        username: newUser.username,
        balance: newUser.balance,
        message: 'Пользователь успешно создан'
    })
    

})

module.exports = router;