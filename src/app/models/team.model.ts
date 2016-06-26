import { Item, Model, TeamItem } from './index';

export class TeamModel<T extends Item & TeamItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
    ];
}
