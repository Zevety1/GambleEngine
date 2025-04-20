import type { SlotsJackpotModel } from './slotJackpot.model';
import { SlotsJackpotRepo } from './slotJackpot.repo';

export class SlotsJackpotService {
    public slotsGameRepo: SlotsJackpotRepo;

    constructor() {
        this.slotsGameRepo = new SlotsJackpotRepo();
    }

    public async getData():Promise<SlotsJackpotModel | null> {
        return await this.slotsGameRepo.getRecord({ activeJackpot:true });
    }

    public async createNewJackpot():Promise<SlotsJackpotModel> {
        return await this.slotsGameRepo.createNewRecord({});
    }

    public async updateData(data:Partial<SlotsJackpotModel>):Promise<void> {
        return await this.slotsGameRepo.updateRecord({ activeJackpot:true }, data);
    } 
}