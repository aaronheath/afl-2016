import { Item, LadderItem, Model } from './index';

export class LadderModel<T extends Item & LadderItem> extends Model<T> {
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
