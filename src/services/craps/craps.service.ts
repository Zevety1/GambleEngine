import type { CrapsModel } from './craps.model';
import { CrapsRepo } from './craps.repo';

export class CrapsService {
    public crapsRepo: CrapsRepo;

    constructor() {
        this.crapsRepo = new CrapsRepo();
    }
    
    public async getUserGameById(userId:string):Promise<CrapsModel | null> {
        return await this.crapsRepo.getRecord({ userId:userId, activeGame:true });
    }

    public async startNewGame(userId:string, bet:number):Promise<CrapsModel> {
        return await this.crapsRepo.createNewRecord({ userId:userId, bet:bet });
    }

    public async updateDataById(userId:string, data:Partial<CrapsModel>):Promise<void> {
        return this.crapsRepo.updateRecord({ userId:userId }, data);
    }

    
}