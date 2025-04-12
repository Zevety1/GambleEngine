import { BaseRepo } from '../helpers';

import { BlackJackModel } from './blackJack.model';


export class BJRepo extends BaseRepo<BlackJackModel> {
    constructor() {
        super(BlackJackModel);
    }
}
