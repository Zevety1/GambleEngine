import * as dotenv from 'dotenv';
import type { Router, Request, Response } from 'express';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { comaprePasswords, hashPassword } from '../../classes/cryptClass';
import { UserService } from '../../services/users/user.service';
import { authValidation } from '../../zod/validation';

dotenv.config();

const router:Router = express.Router();


router.post('/login', async (req:Request, res:Response):Promise<void> => {

    const validation = authValidation.safeParse(req.body);
    if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        res.status(400).json({ error: errorMessage });
        return;
    }

    const { username, password } = validation.data;

    const userService = new UserService();
    const userData = await userService.getUserByUsername(username);

    if (!userData) {
        res.status(400).json({ error: 'Такого пользователя не существует' });
        return;
    }

    if (!(await comaprePasswords(password, userData.password))) {
        res.status(400).json({ error: 'Неверный пароль' });
        return;
    }

    const token = jwt.sign(
        { userId: userData.id, username: userData.username },
        process.env.SECRET as string,
        { expiresIn: '1h' },
    );

    res.status(200).json ({
        token: token,
        userId: userData.id,
        username: userData.username,
        balacne: userData.balance,
        message: 'Авторизация успешно выполнена',
    });
});


router.post('/createNewUser', async (req:Request, res:Response):Promise<void> => {

    const validation = authValidation.safeParse(req.body);
    if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        res.status(400).json({ error: errorMessage });
        return;
    }

    const { username, password } = validation.data;

    const userService = new UserService;

    if (await userService.getUserByUsername(username)) {
        res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        return;
    }

    if (password.length < 5) {
        res.status(400).json({ error: 'Пароль слишком короткий' });
        return;
    }

    const newUserData = await userService.createNewUser(username, await hashPassword(password));
    
    res.status(200).json ({
        userId: newUserData.id,
        username: newUserData.username,
        balance: newUserData.balance,
        message: 'Пользователь успешно создан',
    });
});

export default router;