import type { SlotsGameModel } from './slotGame.model';
import { SlotsGameRepo } from './slotGame.repo';

export class SlotsGameService {
    public slotsGameRepo: SlotsGameRepo;

    constructor() {
        this.slotsGameRepo = new SlotsGameRepo();
    }
    
    public async getUserGameById(userId:string):Promise<SlotsGameModel | null> {
        return await this.slotsGameRepo.getRecord({ userId:userId, activeGame:true });
    }

    public async startNewGame(userId:string, bet:number):Promise<SlotsGameModel> {
        return await this.slotsGameRepo.createNewRecord({ userId:userId, bet:bet });
    }

    public async updateDataById(userId:string, data:Partial<SlotsGameModel>):Promise<void> {
        return this.slotsGameRepo.updateRecord({ userId:userId }, data);
    }
}