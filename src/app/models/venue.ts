import {Model} from './model';
import {Item} from './item';

class VenueItem extends Item {}

class VenueModel<T extends IItem & VenueItem> extends Model<T> {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
        'timezone',
    ];
}

const model = new VenueModel<VenueItem>(VenueItem);

export default model;
