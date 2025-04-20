import { z } from 'zod';

export const betValidation = z.object({
    bet: z.number({ invalid_type_error: 'Ставка должна быть числом' }).int('Ставка должна быть целым числом').positive('Ставка должна быть больше 0'),
});

export const authValidation = z.object({
    username: z.string({ invalid_type_error: 'Имя пользователя должно быть строкой' }),
    password: z.string({ invalid_type_error: 'Имя пользователя должно быть строкой' }).min(5, 'Пароль должен содержать минимум 5 символов'),
});