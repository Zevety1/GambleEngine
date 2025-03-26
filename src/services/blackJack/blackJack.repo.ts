import { Repository } from "typeorm";
import { BlackJackModel } from "./blackJack.model"
import { AppDataSource } from "../../data-source";

export class BJRepo{

    public repo: Repository<BlackJackModel>

    constructor() {
        this.repo = AppDataSource.getRepository(BlackJackModel);
    }

    public async getUserById(userId) {
        return await this.repo.findOne({ where: { userId: userId, activeGame: true } })
    }

    public async updateDataById(userId, data) {
        return this.repo.update({
            userId:userId, activeGame: true
        }, data)
    }

    public async createNewGame(userId:string, bet:number) {
        return await this.repo.save({userId:userId, betInGame:bet})
    }

}
