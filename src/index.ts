

import { AppDataSource } from './data-source';
import * as express from 'express'
import * as gameRoutes from './routes/games/gameRoute'
import * as leaderboardRoute from './routes/leaderboardRoute'
import * as authRoute from './routes/auth/authRoute'
import "reflect-metadata";


const app = express()

app.use(express.json());

app.use('/games', gameRoutes)
app.use('',leaderboardRoute)
app.use('/auth', authRoute)


AppDataSource.initialize()
  .then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server started: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Ошибка подключения к базе данных:', error);
  });