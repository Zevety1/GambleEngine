import { getRepository, Repository } from "typeorm";
import { UserModel} from "./user.model"


export class UserRepo{

    public repo: Repository<UserModel>

    constructor() {
        this.repo = getRepository(UserModel)
    }

    public async saveData(userData) {
        return await this.repo.save(userData)
    }

    public async getUserById(userId:string) {
        return await this.repo.findOne({ where: { id: userId } })
    }

    public async getAllUsers() {
        return await this.repo.find()
    }

    public async findByUsername(username:string) {
        return await this.repo.findOne({ where: { username: username } })
    }

    public async regUser(username:string, password:string) {
        return this.repo.save({username:username, password:password})
    }

}
