
import { UserModel } from './services/users/user.model';
import { CrapsModel } from "./services/craps/craps.model";
import { BlackJackModel } from "./services/blackJack/blackJack.model";
import * as dotenv from 'dotenv'
dotenv.config()


require('reflect-metadata');
const { createConnection } = require('typeorm');

const express = require('express')
const app = express()
const session = require('express-session');


app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));


const gameRoutes = require('./routes/games/gameRoute')
app.use('/games', gameRoutes)

const leaderboardRoute = require('./routes/leaderboardRoute')
app.use('',leaderboardRoute)

const authRoute = require('./routes/auth/authRoute')
app.use('/auth', authRoute)



createConnection({
    type: process.env.DB_TYPE as any,  
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT),     
    username: process.env.DB_USERNAME,      
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME,          
    entities: [UserModel, CrapsModel, BlackJackModel],
    synchronize: process.env.DB_SYNCHRONIZE,  
    logging: process.env.DB_LOGGING,
  })
  .then(() => {

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server started: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Ошибка подключения к базе данных:', error);
  });
  