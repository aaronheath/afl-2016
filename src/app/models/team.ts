import {Model} from './model';
import {Item} from './item';

class TeamItem extends Item {}

class TeamModel<T extends IItem & TeamItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
    ];
}

const model = new TeamModel<TeamItem>(TeamItem);

export default model;
