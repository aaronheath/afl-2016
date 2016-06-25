import { Model, VenueItem } from './index';

export class VenueModel<T extends IItem & VenueItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
        'timezone',
    ];
}

