import { DataSource, DeepPartial } from "typeorm";
import { UserRepo } from "./user.repo";
import { UserModel } from "./user.model";

export class UserService {
    public userRepo: UserRepo;

    constructor(db: DataSource) {
        this.userRepo = new UserRepo();
    }    

    public async plusBet(userId:string, bet:number) {
        const userData = await this.userRepo.getUserById(userId)
        userData.balance += bet
        await this.userRepo.saveData(userData)
    }

    public async minusBet(userId:string, bet:number) {
        const userData = await this.userRepo.getUserById(userId)
        userData.balance -= bet
        await this.userRepo.saveData(userData)
    }

    public async getTopUsers() {
        const usersData = await this.userRepo.getAllUsers({
            order: {balance: "DESC"},
            take: 10
        })
        return usersData1
    }

}