import * as compression from 'compression';
import * as express from 'express';
import helmet from 'helmet';


import { AppDataSource } from './data-source';
import authRoute from './routes/auth/authRoute';
import gameRoutes from './routes/games/gameRoute';
import leaderboardRoute from './routes/leaderboardRoute';
import { notFoundHandler, errorHandler } from './routes/middleware/errors';
import 'reflect-metadata';


const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/games', gameRoutes);
app.use('',leaderboardRoute);
app.use('/auth', authRoute);

app.use(notFoundHandler);
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        const PORT = Number(process.env.SERVER_PORT);
        app.listen(PORT, () => {
            console.log(`Server started: http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Ошибка подключения к базе данных:', error);
    });