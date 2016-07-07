import { Item, Model, TeamItem } from './index';

/**
 * TeamModel
 *
 * Store for AFL teams.
 */
export class TeamModel<T extends Item & TeamItem> extends Model<T> {
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
    ];
}
