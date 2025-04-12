import type { UserModel } from './user.model';
import { UserRepo } from './user.repo';

export class UserService {
    public userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    public async updateDataById(userId:string, data:Partial<UserModel>):Promise<void> {
        return await this.userRepo.updateRecord({ id:userId }, data);
    }   

    public async getUserById(userId:string):Promise<UserModel | null> {
        return await this.userRepo.getRecord({ id:userId });
    }

    public async getUserByUsername(username:string):Promise<UserModel | null> {
        return await this.userRepo.getRecord({ username:username });
    }

    public async createNewUser(username:string, password:string):Promise<UserModel> {
        return await this.userRepo.createNewRecord({ username:username, password:password } );
    }

    public async getTopUsers():Promise<UserModel[]> {
        return await this.userRepo.getTopTenUsers();
    }
}