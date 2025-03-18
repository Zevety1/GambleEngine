import { getRepository, Repository } from "typeorm";
import { CrapsModel } from "./craps.model"


export class CrapsRepo{

    public repo: Repository<CrapsModel>

    constructor() {
        this.repo = getRepository(CrapsModel)
    }

    public async getUserById(userId) {
        const crapsData = await this.repo.findOne({ where: { user_id: userId } })
        return crapsData
    }

    public async updateDataById(userId, stageGame?, setValue?) {
        const crapsData = await this.repo.findOne({ where: { user_id: userId } })
        if (stageGame !== undefined) {
            crapsData.stage_game = stageGame;
          }
          if (setValue !== undefined) {
            crapsData.set_value = setValue;
          }
        await this.repo.save(crapsData)
    }

    public async newUser(userId:string) {
        const newUser = this.repo.create({user_id:userId})
        await this.repo.save(newUser)
    }

}
