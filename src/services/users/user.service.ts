import { UserRepo } from "./user.repo";

export class UserService {
    public userRepo: UserRepo;

    constructor() {
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

    public async getUserById(userId:string) {
        return await this.userRepo.getUserById(userId)
    }

    public async findByUsername(username:string) {
        return await this.userRepo.findByUsername(username)
    }

    public async createNewUser(username:string, password:string) {
        return await this.userRepo.createNewUser(username, password)
    }

    public async getTopUsers() {
        return await this.userRepo.getTopUsers()
    }

}