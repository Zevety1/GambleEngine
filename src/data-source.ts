import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { BlackJackModel } from './services/blackJack/blackJack.model';
import { CrapsModel } from './services/craps/craps.model';
import { SlotsGameModel } from './services/slot/game/slotGame.model';
import { SlotsJackpotModel } from './services/slot/jackpot/slotJackpot.model';
import { UserModel } from './services/users/user.model';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT),     
    username: process.env.DB_USERNAME,      
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME,          
    entities: [UserModel, CrapsModel, BlackJackModel, SlotsGameModel, SlotsJackpotModel],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',  
    logging: process.env.DB_LOGGING === 'true',
});
