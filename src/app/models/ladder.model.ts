import { Item, LadderItem, Model } from './index';

/**
 * LadderModel
 *
 * Store and ranking model of AFL Premiership Ladder
 */
export class LadderModel<T extends Item & LadderItem> extends Model<T> {
    /**
     * Fields permissible to be set with Item's create method.
     *
     * @type {string[]}
     */
    protected fillable = [
        'id',
        'wins',
        'losses',
        'draws',
        'goalsFor',
        'behindsFor',
        'goalsAgainst',
        'behindsAgainst',
    ];

    /**
     * Returns array of LadderTeams in order of thier position based on premiership results.
     *
     * Ranking is by:
     * 1. Premiership Points
     * 2. Percentage
     * 3. Points For
     * 4. Full name in ascending alphabetical order
     *
     * @returns {T[]}
     */
    ranked() : LadderItem[] {
        return this.all().sort((a, b) => {
            let compare;

            // Compare points
            compare = b.points() - a.points();

            if(compare !== 0) {
                return compare;
            }

            // Compare percentage
            compare = b.percentage() - a.percentage();

            if(compare !== 0) {
                return compare;
            }

            // Compare pointsFor
            compare = b.pointsFor() - a.pointsFor();

            if(compare !== 0) {
                return compare;
            }

            // Compare name
            return a.team().get('fullName').localeCompare(b.team().get('fullName'));
        });
    }
}
