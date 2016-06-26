import { Item, Model, VenueItem } from './index';

export class VenueModel<T extends Item & VenueItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
        'timezone',
    ];
}
