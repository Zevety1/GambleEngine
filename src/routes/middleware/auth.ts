import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';


interface IUserPayload {
    userId: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user: IUserPayload;
    }
}

export function authJwtMiddleware(req:Request, res:Response, next:NextFunction):void {
    const token = req.headers.authorization?.split(' ')[1];
      
    if (!token) {
        res.status(401).json({ error: 'Требуется токен авторизации' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as IUserPayload;
        req.user = { 
            userId: decoded.userId,
        };
        next();
    } catch {
        res.status(401).json({ error: 'Недействительный токен' });
        return;
    }
}

