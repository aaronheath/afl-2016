import {Model} from './model';
import {Item} from './item';
import TeamModel from './team';

declare const moment;

class LadderItem extends Item {
    //
}

class LadderModel extends Model {
    protected fillable = [
        'id',
        'wins',
        'losses',
        'draws',
        'goalsFor',
        'behindsFor',
        'goalsAgainst',
        'behindsAgainst',
    ];
}

const model = new LadderModel(LadderItem);

export default model;
