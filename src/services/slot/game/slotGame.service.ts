import { SlotsGameRepo } from "./slotGame.repo";

export class SlotsGameService {
    public slotsGameRepo: SlotsGameRepo;

    constructor() {
        this.slotsGameRepo = new SlotsGameRepo();
      }
  
    public async getUserById(userId) {
        return await this.slotsGameRepo.getUserById(userId)
    }

    public async StartNewGame(userId, bet) {
        return await this.slotsGameRepo.createNewGame(userId, bet)
    }

    public async updateDataById(userId, data) {
        return await this.slotsGameRepo.updateDataById(userId, data);
    }

    
}