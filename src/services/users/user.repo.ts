import { BaseRepo } from '../helpers';

import { UserModel } from './user.model';

export class UserRepo extends BaseRepo<UserModel> {
    constructor() {
        super(UserModel);
    }

    public async getTopTenUsers():Promise<UserModel[]> {
        return await this.repo.find({
            order: { balance: 'DESC' },
            take: 10,
        });
    }
}
