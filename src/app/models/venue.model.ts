import { Item, Model, VenueItem } from './index';

/**
 * TeamModel
 *
 * Store for AFL venues.
 */
export class VenueModel<T extends Item & VenueItem> extends Model<T> {
    /**
     * Fields permissible to be set with Item's create method.
     *
     * @type {string[]}
     */
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
        'timezone',
    ];
}
