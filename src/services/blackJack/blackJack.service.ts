import type { BlackJackModel } from './blackJack.model';
import { BJRepo } from './blackJack.repo';

export class BJService {
    public bjRepo: BJRepo;

    constructor() {
        this.bjRepo = new BJRepo();
    }

    public async getUserGameById(userId:string):Promise<BlackJackModel | null> {
        return await this.bjRepo.getRecord({ userId:userId, activeGame:true });
    }

    public async startNewGame(userId:string, bet:number):Promise<BlackJackModel> {
        return await this.bjRepo.createNewRecord({ userId:userId, bet:bet });
    }

    public async updateDataById(userId:string, data:Partial<BlackJackModel>):Promise<void> {
        return this.bjRepo.updateRecord({ userId:userId }, data);
    }

}