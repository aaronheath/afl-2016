import { Item, Model, MatchItem } from './index';

/**
 * MatchModel
 *
 * Store for Premiership Matches.
 */
export class MatchModel<T extends Item & MatchItem> extends Model<T> {
    /**
     * Fields permissible to be set with Item's create method.
     *
     * @type {string[]}
     */
    protected fillable = [
        'home',
        'homeGoals',
        'homeBehinds',
        'away',
        'awayGoals',
        'awayBehinds',
        'venue',
        'date',
        'time',
        'attendance',
        'roundNo',
    ];

    /**
     * Array of MatchItem's where the match has been played.
     *
     * @returns {T[]}
     */
    public wherePlayed() : MatchItem[] {
        return this.all().filter((item) => !!item.result());
    }

    /**
     * Returns array of known round numbers.
     *
     * @returns {number[]}
     */
    public roundNumbers() : number[] {
        const roundNumbers = this.all().map((item) => +item.get('roundNo'));

        return _.uniq(roundNumbers);
    }
}
