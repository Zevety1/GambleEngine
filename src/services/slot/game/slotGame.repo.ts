import { BaseRepo } from '../../helpers';

import { SlotsGameModel } from './slotGame.model';


export class SlotsGameRepo extends BaseRepo<SlotsGameModel> {
    constructor() {
        super(SlotsGameModel);
    }
}

