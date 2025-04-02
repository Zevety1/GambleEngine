import { Repository } from "typeorm";
import { SlotsGameModel } from "./slotGame.model"
import { AppDataSource } from "../../../data-source";



export class SlotsGameRepo{

    public repo: Repository<SlotsGameModel>

    constructor() {
        this.repo = AppDataSource.getRepository(SlotsGameModel);
    }

    public async getUserById(userId:string) {
        return await this.repo.findOne({ where: { userId: userId, activeGame: true }})
    }

    public async updateDataById(userId, data) {
        return await this.repo.update({
            userId:userId, activeGame: true
        }, data)
    }

    public async createNewGame(userId:string, bet:number) {
        return await this.repo.save({userId: userId, bet:bet})
    }

}
