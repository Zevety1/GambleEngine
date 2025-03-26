import * as jwt from 'jsonwebtoken';

export function authJwtMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Требуется токен авторизации' });
    }


    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        if (req.body.id !== req.user.userId) {
            return res.status(400).json({error: 'Недействительный токен'})
        }
        next();
    } catch {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
}