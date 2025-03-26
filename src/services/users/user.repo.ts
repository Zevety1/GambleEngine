import { Repository } from "typeorm";
import { UserModel} from "./user.model"
import { AppDataSource } from "../../data-source";
import { hashPassword } from "../../classes/cryptClass";

export class UserRepo{

    public repo: Repository<UserModel>

    constructor() {
        this.repo = AppDataSource.getRepository(UserModel);
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

    public async createNewUser(username:string, password:string) {
        return this.repo.save({username:username, password: await hashPassword(password)})
    }

    public async getTopUsers() {
    return await this.repo.find({
             order: {balance: "DESC"},
             take: 10
            })

        }
    }