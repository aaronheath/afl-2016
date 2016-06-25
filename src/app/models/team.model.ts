import { Model, TeamItem } from './index';

export class TeamModel<T extends IItem & TeamItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
    ];
}
