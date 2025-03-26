import { CrapsRepo } from "./craps.repo";

export class CrapsService {
    public crapsRepo: CrapsRepo;

    constructor() {
        this.crapsRepo = new CrapsRepo();
      }
  
    public async getUserById(userId) {
        return await this.crapsRepo.getUserById(userId)
    }

    public async StartNewGame(userId, bet) {
        return await this.crapsRepo.createNewGame(userId, bet)
    }

    public async updateDataById(userId, data) {
        return this.crapsRepo.updateDataById(userId, data);
    }

    
}