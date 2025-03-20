
import { UserModel } from './services/users/user.model';
import { CrapsModel } from "./services/craps/craps.model";
import { BlackJackModel } from "./services/blackJack/blackJack.model";
import { DataSource } from 'typeorm';
import express from 'express'
import * as gameRoutes from './routes/games/gameRoute'
import * as leaderboardRoute from './routes/leaderboardRoute'
import * as authRoute from './routes/auth/authRoute'
import * as dotenv from 'dotenv'
dotenv.config()


const app = express()

app.use(express.json());


app.use('/games', gameRoutes)
app.use('',leaderboardRoute)
app.use('/auth', authRoute)



const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT),     
  username: process.env.DB_USERNAME,      
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,          
  entities: [UserModel, CrapsModel, BlackJackModel],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',  
  logging: process.env.DB_LOGGING === 'true',
});

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