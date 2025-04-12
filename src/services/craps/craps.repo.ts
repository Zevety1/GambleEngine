import { BaseRepo } from '../helpers';

import { CrapsModel } from './craps.model';


export class CrapsRepo extends BaseRepo<CrapsModel> {
    constructor() {
        super(CrapsModel);
    }
}
