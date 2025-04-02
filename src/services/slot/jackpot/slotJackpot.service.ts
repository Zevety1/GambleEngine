import { SlotsJackpotRepo } from "./slotJackpot.repo";

export class SlotsJackpotService {
    public slotsGameRepo: SlotsJackpotRepo;

    constructor() {
        this.slotsGameRepo = new SlotsJackpotRepo();
      }

    public async getData() {
        return await this.slotsGameRepo.getData()
    }

    public async createNewJackpot() {
        return await this.slotsGameRepo.createNewJackpot()
    }

    public async updateData(data) {
        return await this.slotsGameRepo.updateData(data);
    }

    
}