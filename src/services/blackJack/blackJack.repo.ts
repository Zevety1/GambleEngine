import { getRepository, Repository } from "typeorm";
import { BlackJackModel } from "./blackJack.model"

export class BJRepo{

    public repo: Repository<BlackJackModel>

    constructor() {
        this.repo = getRepository(BlackJackModel)
    }

    public async getUserById(userId) {
        const BJData = await this.repo.findOne({ where: { user_id: userId } })
        return BJData
    }

    public async updateDataById(userId, stageGame) {
        const BJData = await this.repo.findOne({ where: { user_id: userId } })
        BJData.stage_game = stageGame
        await this.repo.save(BJData)
    }

    public async newUser(userId:string) {
        const newUser = this.repo.create({user_id:userId})
        await this.repo.save(newUser)
    }

}
