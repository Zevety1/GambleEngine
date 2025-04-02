import { Repository } from "typeorm";
import { SlotsJackpotModel } from "./slotJackpot.model"
import { AppDataSource } from "../../../data-source";



export class SlotsJackpotRepo{

    public repo: Repository<SlotsJackpotModel>

    constructor() {
        this.repo = AppDataSource.getRepository(SlotsJackpotModel);
    }

    public async getData() {
        return await this.repo.findOne({where : {activeJackpot: true }})
    }

    public async updateData(data) {
        return await this.repo.update({
            activeJackpot: true
        }, data)
    }

    public async createNewJackpot() {
        return await this.repo.save({})
    }

}
