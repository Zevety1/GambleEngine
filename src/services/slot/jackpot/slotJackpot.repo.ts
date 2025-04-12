import { BaseRepo } from '../../helpers';

import { SlotsJackpotModel } from './slotJackpot.model';


export class SlotsJackpotRepo extends BaseRepo<SlotsJackpotModel> {
    constructor() {
        super(SlotsJackpotModel);
    }
}
