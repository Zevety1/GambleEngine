import { getRepository, Repository } from "typeorm";
import { UserModel} from "./user.model"


export class UserRepo{

    public repo: Repository<UserModel>

    constructor() {
        this.repo = getRepository(UserModel)
    }

    public async getUserById(userId:string) {
        const userData = await this.repo.findOne({ where: { id: userId } })
        return userData
    }

    public async getTopUsers() {
        const usersData = await this.repo.find({
            order: {balance: "DESC"},
            take: 10
        })
        return usersData
    }

    public async plusBet(userId:string, bet:number) {
        const userData = await this.getUserById(userId)
        userData.balance += bet
        await this.repo.save(userData)
    }

    public async minusBet(userId:string, bet:number) {
        const userData = await this.getUserById(userId)
        userData.balance -= bet
        await this.repo.save(userData)
    }

    public async findByUsername(username:string) {
        const userData = await this.repo.findOne({ where: { username: username } })
        return userData
    }

    public async regUser(username:string, password:string) {
        const newUser = this.repo.create({username:username, password:password})
        await this.repo.save(newUser)
        return newUser
    }

}
