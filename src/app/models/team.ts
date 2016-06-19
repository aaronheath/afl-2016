import {Model} from './model';
import {Item} from './item';

class TeamItem extends Item {}

class TeamModel extends Model {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
    ];
}

const model = new TeamModel(TeamItem);

export default model;
