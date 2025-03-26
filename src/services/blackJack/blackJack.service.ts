import { BJRepo } from "./blackJack.repo";

export class BJService {
    public bjRepo: BJRepo;

    constructor() {
        this.bjRepo = new BJRepo();
      }

    public async getUserById(userId) {
        return await this.bjRepo.getUserById(userId)
    }

    public async startNewGame(userId:string, bet:number) {
        return await this.bjRepo.createNewGame(userId, bet)
    }

    public async updateDataById(userId, data) {
        return this.bjRepo.updateDataById(userId, data);
    }

}