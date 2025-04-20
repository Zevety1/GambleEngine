import type { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Ошибка 404',
    });
    return;
};

export const errorHandler = (err: Error, req: Request, res: Response) => {
    res.status(500).json({
        error: 'Ошибка 500',
    });
};
