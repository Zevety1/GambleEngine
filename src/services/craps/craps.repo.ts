import { Repository } from "typeorm";
import { CrapsModel } from "./craps.model"
import { AppDataSource } from "../../data-source";



export class CrapsRepo{

    public repo: Repository<CrapsModel>

    constructor() {
        this.repo = AppDataSource.getRepository(CrapsModel);
    }

    public async getUserById(userId:string) {
        return await this.repo.findOne({ where: { userId: userId, activeGame: true }})
    }

    public async updateDataById(userId, data) {
        return this.repo.update({
            userId:userId, activeGame: true
        }, data)
    }

    public async createNewGame(userId:string, bet:number) {
        return await this.repo.save({userId: userId, betInGame:bet})
    }

}
